import { ChatService } from "../services/chat.service.js"

export default () => {
    const chatService = new ChatService();

    return chatService;
}