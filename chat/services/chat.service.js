import { readFile } from 'node:fs/promises'
const OLLAMA_URL = process.env.OLLAMA_URL;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL;

export class ChatService {
    async sendMessage(message, abort) {
        const prompt = await this.readPrompt('./prompt.txt');

        const res = await fetch(OLLAMA_URL + '/api/chat', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: OLLAMA_MODEL, 
                    messages: [
                        {
                            role: "user", 
                            content: `${prompt}\n\n# Pergunta: ${message} ?`
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
        
        
        return res.json();
    }

    async readPrompt(filePath) {
        return await readFile(filePath, { encoding: 'utf-8' });    
    }
}