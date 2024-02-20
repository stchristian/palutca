import { messages } from "../botTexts.js";
import { CommandHandler } from "../command.types.ts";

export const handleUnknown: CommandHandler = (message, cmd) => {
  return messages.unknownCommand(cmd);
};
