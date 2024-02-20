import { messages } from "../botTexts.js";
import { CommandHandler } from "../command.types.js";
import { notificationService } from "../notificationService.js";

export const handleList: CommandHandler = async (message) => {
  const telegramUserId = message.from.id;

  // Get rules for the specific user
  const items = await notificationService.listNotifications(telegramUserId.toString());

  console.log("Items: ", items);

  if (items.length === 0) {
    return messages.noNotifications;
  }

  return items.map(messages.toListItem).join("\n");
};
