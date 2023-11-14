import { messages } from "../botTexts.js";

export function handleUnknown(message, cmd) {
  return messages.unknownCommand(cmd);
}
