import { string, tuple } from "yup";
import { notificationService } from "../notificationService.js";
import { messages } from "../botTexts.js";

export const handleUpdateSelector = async (message, cmd, params) => {
  const [name, selector] = params;
  const telegramUserId = message.from.id;

  const notificationId = notificationService.getNotificationId(name, telegramUserId);

  await notificationService.updateInputForNotification(notificationId, {
    selector,
  });

  return messages.selectorUpdatedSuccessfully;
};

handleUpdateSelector.schema = tuple([
  string().label("name").required("Name is required"),
  string().label("selector").required("Selector is required"),
]);
