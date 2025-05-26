import 'dotenv/config';
import { initTracing } from './src/tracing.js';
await initTracing();

import { trace, context } from '@opentelemetry/api';
import { readFileSync } from 'fs';
import path from 'node:path';
import { createLRU } from 'lru.min';
import { normalizeQuestion } from './src/normalizeQuestion.js'
import cors from '@fastify/cors';

import Fastify from 'fastify';

const app = Fastify({
    logger: false,
    // ignoreTrailingSlash: true,
    // bodyLimit: 1048576,
    // connectionTimeout: 10000,
    // requestTimeout: 10000,
});

const lru = createLRU({
    max: 150_000,
    onEviction: (key, value) => {
        console.log('evicted', key, value);
    }
});

const openai = {
  model: process.env.OPENAI_MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  apiHost: process.env.OPENAI_API_HOST,
}
const PROMPTS_FILE_PATH = process.env.PROMPT_FILE_PATH || path.resolve(process.cwd(), 'src/prompts');
const PORT = process.env.APP_PORT || 8090;
const ORIGIN = process.env.APP_CORS_ORIGIN_URL || '*';
const MAIN_PROMPT = readFileSync(PROMPTS_FILE_PATH + '/index.md', 'utf-8');
const RECOMMENDATIONS_PROMPT = readFileSync(PROMPTS_FILE_PATH + '/recommendations.md', 'utf-8');

console.log('Prompt file loaded:', PROMPTS_FILE_PATH);
console.log('OPENAI_CONFIG: ', openai);

app.register(cors, {
  origin: ORIGIN,
  methods: ['GET', 'POST', 'OPTIONS'],
});

app.get('/v1/chat/verify', async (req, res) => {
  return res.send({
    successfully: true,
    message: 'Assistant API running!'
  });
});

app.post('/v1/chat/message', async (req, res) => {
  const { question } = req.body;
  const abort = new AbortController();
  const span = trace.getSpan(context.active());
  const normalizedQuestion = normalizeQuestion(question);

  span.addEvent('Message endpoint called');
  span.setAttributes({
    'http.body.question': question,
    'http.body.normalized_question': normalizedQuestion,
  });

  if (!question) {
    return res.status(400).send({ error: 'Field question is required' });
  }

  const cached = lru.get(normalizedQuestion);
  
  if (cached) {
    span.addEvent('Cache check', { question: question, cached: cached });

    return res.send({
      success: true,
      question: question,
      content: cached,
      duration: 0
    });
  }

  const modelResponse = await fetch(openai.apiHost + '/api/chat', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          model: openai.model, 
          messages: [
              {
                  role: "user", 
                  content: `${MAIN_PROMPT}\n\n# Pergunta: ${question}`
              }
          ],
          options: {
              temperature: 0,
              repetition_penalty: 1.2,
              presence_penalty: 0.5,
              max_tokens: 100
          },
          stream: false
      }),
      signal: abort.signal,
      keepalive: true,
  });

  if (!modelResponse.ok) {
    span.recordException(new Error('Error fetching from OLLAMA API'));
    return res.status(500).send({ error: 'Error fetching from OLLAMA API' });
  }

  const data = await modelResponse.json();

  lru.set(normalizedQuestion, data.message.content);

  return res.send({
    success: true,
    question: question,
    content: data.message.content,
    duration: data.load_duration
  });
})

// STREAM
async function* streamResponse(content) {
  const completion = await fetch(openai.apiHost + '/api/chat', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          model: openai.model, 
          messages: [
              {
                  role: "user", 
                  content
              }
          ],
          options: {
              temperature: 0,
              repetition_penalty: 1.2,
              presence_penalty: 0.5,
              max_tokens: 100
          },
          stream: true
      }),
      // signal: abort.signal,
      keepalive: true,
  });

  for await (const chunk of completion.body) {
    
    yield chunk;
  }
}

app.post('/v1/chat/message/stream', async (req, res) => {
  try {
    res.raw.setHeader('Access-Control-Allow-Origin', ORIGIN);
    res.raw.setHeader('Access-Control-Allow-Credentials', 'true');
    res.raw.setHeader('Content-Type', 'text/event-stream');
    res.raw.setHeader('Cache-Control', 'no-cache');
    res.raw.setHeader('Connection', 'keep-alive');

    res.raw.flushHeaders?.();

    const { question } = req.body;
    const span = trace.getSpan(context.active());
    const normalizedQuestion = normalizeQuestion(question);

    span.addEvent('Message endpoint called');
    span.setAttributes({
      'http.body.question': question,
      'http.body.normalized_question': normalizedQuestion,
    });

    if (!question) {
      return res.status(400).send({ error: 'Field question is required' });
    }

    const cached = lru.get(normalizedQuestion);
    
    if (cached) {
      span.addEvent('Cache check', { question: question, cached: cached });

      for await (const chunk of cached) {
        res.raw.write(chunk);
        res.raw.flush?.();
      }

      res.raw.end();
      return;
    }

    const modelResponse = await streamResponse(`${MAIN_PROMPT}\n\n# Pergunta: ${question}`);
    const chunks = [];
  
    for await (const chunk of modelResponse) {
      const jsonChunk = Buffer.from(chunk).toString('utf-8');
      const parsedChunk = JSON.parse(jsonChunk);
      const content = parsedChunk.message.content;
      
      chunks.push(content);

      res.raw.write(content);
      res.raw.flush?.();
    }
  
    res.raw.end();
  
    const fulltext = chunks.join('');
  
    lru.set(normalizedQuestion, fulltext);
  
    return;
  } catch (error) {
    console.error('Error streaming response:', error);
    return res.status(500).send({ error: 'Error streaming response' });
  }

})

app.post('/v1/chat/recommendation/stream', async (req, res) => {
  try {
    res.raw.setHeader('Access-Control-Allow-Origin', ORIGIN);
    res.raw.setHeader('Access-Control-Allow-Credentials', 'true');
    res.raw.setHeader('Content-Type', 'text/event-stream');
    res.raw.setHeader('Cache-Control', 'no-cache');
    res.raw.setHeader('Connection', 'keep-alive');

    res.raw.flushHeaders?.();

    const { company } = req.body;
    const prompt = RECOMMENDATIONS_PROMPT
      .replace(/{{companyName}}/g, company.name)
      .replace(/{{department}}/g, company.department)
      .replace(/{{description}}/g, company.description)
      .replace(/{{interestedValue}}/g, company.interestedValue)
      .replace(/{{interestedLabel}}/g, company.interestedLabel)
      .replace(/{{productsGenerated}}/g, company.productsGenerated);

    
    span.addEvent('Recommendation endpoint called');
    span.setAttributes({
      'http.body.name': company.name,
      'http.body.department': company.department,
      'http.body.description': company.description,
      'http.body.interestedValue': company.interestedValue,
      'http.body.interestedLabel': company.interestedLabel,
      'http.body.productsGenerated': company.productsGenerated,
    });

    const modelResponse = await streamResponse(prompt);
    const chunks = [];
  
    for await (const chunk of modelResponse) {
      const jsonChunk = Buffer.from(chunk).toString('utf-8');
      const parsedChunk = JSON.parse(jsonChunk);
      const content = parsedChunk.message.content;
      
      chunks.push(content);

      res.raw.write(content);
      res.raw.flush?.();
    }
  
    res.raw.end();
  
    return;
  } catch (error) {
    console.error('Error streaming response:', error);
    return res.status(500).send({ error: 'Error streaming response' });
  }
})

try {
  await app.listen({ port: PORT, host: '0.0.0.0' }, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}