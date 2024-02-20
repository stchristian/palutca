// Type annotations for Telegram API's response objects
// This includes only a subset of types, feel free to add more.

/**
 * Update object: https://core.telegram.org/bots/api#update
 */
export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

interface TelegramMessage {
  message_id: number;
  chat: TelegramChat;
  date: number;
  entities?: TelegramMessageEntity[];
  from?: TelegramUser;
  text?: string;
}

interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  language_code: string;
}

interface TelegramChat {
  id: number;
  first_name: string;
  type: ChatType;
}

type ChatType = "group" | "private" | "supergroup" | "channel";
type EntityType = "bot_command" | "mention" | "hashtag" | "url";

interface TelegramMessageEntity {
  offset: number;
  length: number;
  type: EntityType;
}
