import axios from "axios";

const API_URL = `${process.env.TELEGRAM_API_BASE_URL}/bot${process.env.TELEGRAM_TOKEN}`;
const ENDPOINTS = {
  SEND_MESSAGE: "/sendMessage",
};

const telegramApi = axios.create({
  baseURL: API_URL,
  timeout: 1000,
});

export function sendMessage(chatId, text) {
  return telegramApi.post(ENDPOINTS.SEND_MESSAGE, { text, chat_id: chatId });
}
