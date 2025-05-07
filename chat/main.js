import 'dotenv/config';
import http from 'node:http';
import { ChatController } from './controllers/chat.controller.js';

const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CHAT_CORS_ORIGIN;

const DEFAULT_HEADER = {
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, ngrok-skip-browser-warning',
    'Content-Type': 'application/json'
}
const rateLimit = {};

const checkRateLimit = (ip) => {
    const currentTime = Date.now();
    const limitTimeWindow = 60000;
    const maxRequests = 5;

    if (!rateLimit[ip]) {
        rateLimit[ip] = [];
    }

    rateLimit[ip] = rateLimit[ip].filter(timestamp => currentTime - timestamp < limitTimeWindow);

    if (rateLimit[ip].length >= maxRequests) {
        return false;
    }

    rateLimit[ip].push(currentTime);
    return true;
}

const handler = (request, response) => {
    const { url, method, socket } = request
    const clientIp = socket.remoteAddress;

    if (method === 'OPTIONS') {
        response.writeHead(204, DEFAULT_HEADER);
        response.end();
        return;
    }

    if (!checkRateLimit(clientIp)) {
        response.writeHead(429, DEFAULT_HEADER);
        response.end(JSON.stringify({ success: false, message: "Limite de requisições excedido. Tente novamente mais tarde." }));
        return;
    }

    const [path, queryString] = url.split('?');
    const route = path.split('/').filter(Boolean);

    const params = queryString ? queryString.split('&').reduce((acc, param) => {
        const [key, value] = param.split('=');
        acc[key] = value;
        return acc;
    }, {}) : {};
    
    let key = `/${route.join('/')}:${method.toLowerCase()}`;

    response.writeHead(200, DEFAULT_HEADER)

    const chosen = ChatController[key] || ChatController.default

    return chosen(request, response, params)
}

http.createServer(handler)
    .listen(PORT)
    .on('connect', () => console.log('Client Conected'))
    .on('listening', async () => {
        console.log('Running at PORT ', PORT);
    })