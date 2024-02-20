import { Schema } from "yup";
import { TelegramMessage } from "./telegram";

export type CommandHandler = (message: TelegramMessage, command: string, params: string[]) => string | Promise<string>;

export type Command = {
  handler: CommandHandler;
  paramsSchema?: Schema;
};
