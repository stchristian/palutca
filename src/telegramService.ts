import axios from "axios";

const TELEGRAM_API_BASE_URL = `${process.env.TELEGRAM_API_BASE_URL}/bot${process.env.TELEGRAM_TOKEN}`;

class TelegramService {
  telegramApi = axios.create({
    baseURL: TELEGRAM_API_BASE_URL,
    timeout: 1000,
  });

  sendMessage(chatId: number, text: string) {
    const path = "/sendMessage";
    return this.telegramApi.post(path, { text, chat_id: chatId });
  }
}

export default new TelegramService();
