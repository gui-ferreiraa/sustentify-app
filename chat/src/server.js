Object.entries(process.env).forEach(([key, value]) => {
    if (typeof value === 'string' && value.includes('${DOMAIN}')) {
      process.env[key] = value.replace('${DOMAIN}', process.env.DOMAIN || '');
    }
});
  import 'dotenv/config';
  import OpenAI from 'openai';
  import { readFile } from 'node:fs/promises'
  import { createLRU } from 'lru.min';
  import { observeOpenAI, Langfuse } from 'langfuse';
  
  import Fastify from 'fastify';
  const PORT = process.env.APP_PORT;
  
  const app = Fastify({ logger: true })
  
  const lru = createLRU({
    max: 150_000,
    onEviction: (key, value) => {
      console.log('evicted', key, value);
    },
  });
  
  const openAIData = {
    model: process.env.OLLAMA_MODEL,
    baseURL: process.env.OPENAI_SITE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  }
  
  const langfuse = new Langfuse({
    secretKey: process.env.LANGFUSE_SECRET_KEY,
    publicKey: process.env.LANGFUSE_PUBLIC_KEY,
    baseUrl: process.env.LANGFUSE_BASEURL,
  });
  const span = langfuse.trace({ name: 'sustentify-openai' })
  const openai = observeOpenAI(new OpenAI(openAIData), {
    parent: span
  });
  
  async function* prompt(content) {
    const textPrompt = await readFile('./prompt.txt', { encoding: 'utf-8' }); 

    const completion = await openai.chat.completions.create({
      model: openAIData.model,
      messages: [
        {
          role: 'user',
          content: `${textPrompt}\n\n# Pergunta: ${content}`
        },
      ],
      stream: true,
    });
  
    for await (const chunk of completion) {
      yield chunk.choices[0].delta.content;
    }
  }
  
  app.get('/v2/chat/verify', (req, reply) => {
    
    return reply.status(200).send({ message: 'success', successfully: true })
  })

  app.post('/v2/chat/question', async (request, reply) => {
    const { question } = request.body; 
  
    // Check cache
    const cached = lru.get(question);
    if (cached) {
      return reply.status(200).send(cached);
    }
  
    try {
      const responseStream = await prompt(question);
      const chunks = [];

      for await (const chunk of responseStream) {
        chunks.push(chunk);
        app.log.warn('res', chunk);
      }
  
      // Cache result
      const fullText = chunks.join('');
      lru.set(question, fullText);
      
      return reply.status(200).send(fullText);
    } catch (error) {
      app.log.error(error);
  
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  app.post('/v2/chat/stream', async (request, reply) => {
    if (!reply.raw.headersSent) {
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
    const { question } = request.body; 
  
    // Check cache
    const cached = lru.get(question);
    if (cached) {
      return reply.status(200).send(cached);
    }
  
    try {
      const responseStream = await prompt(question);
      const chunks = [];
  
      reply.raw.writeHead(200, { 'Content-Type': 'text/plain' });
      for await (const chunk of responseStream) {
        chunks.push(chunk);
        reply.raw.write(chunk);
      }
      reply.raw.end();
  
      // Cache result
      const fullText = chunks.join('');
      lru.set(question, fullText);
  
      return; // 200 OK by default for Fastify when no error
    } catch (error) {
      app.log.error(error);
  
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });
  
  const address = await app.listen({ host: '0.0.0.0', port: PORT })
  app.log.info(`Server is running on ${address}`);