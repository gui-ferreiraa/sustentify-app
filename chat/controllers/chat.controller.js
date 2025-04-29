import chatFactory from '../factories/chat.factory.js'
import { createLRU } from 'lru.min';

const chatService = chatFactory();
const lru = createLRU({
    max: 150_000,
    onEviction: (key, value) => {
        console.log('evicted', key, value);
    }
})

export const ChatController = {
    '/v1/chat/verify:get': async (req, res, params) => {
        const body = {
            successfully: true,
            message: 'Api running!'
        }

        res.write(JSON.stringify(body))
        res.end()
    },
    '/v1/chat:get': async (req, res, params) => {
        let abort = new AbortController();

        if (!params.message) {
            res.write(JSON.stringify({ error: true, message: 'Param message not found!' }));
            res.end();
            return;
        }

        let decodedMessage = params.message;

        try {
            decodedMessage = decodeURIComponent(params.message);
        } catch (err) {
            decodedMessage = params.message.replaceAll('%', ' ');
        }
    
        const cached = lru.get(decodedMessage)
        if (cached) {
            res.write(JSON.stringify({
                success: true,
                question: decodedMessage + ' ?',
                content: cached,
                duration: '0'
            }))
            res.end()
            return;
        }
        
        req.once('close', () => {
            abort.abort();
        })

        try {
            const data = await chatService.sendMessage(decodedMessage, abort);

            const body = {
                success: true,
                question: decodedMessage + ' ?',
                content: data.message.content,
                duration: data.load_duration
            }


            lru.set(decodedMessage, data.message.content);
            
            res.write(JSON.stringify(body));
            res.end();
        } catch (err) {
            res.write(JSON.stringify({ error: true }))
            res.end();
        }
    },

    default: (req, res) => {
        res.write('Not Found 404')
        res.end()
    }
}