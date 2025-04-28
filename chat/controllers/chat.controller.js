import chatFactory from '../factories/chat.factory.js'

const chatService = chatFactory();

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