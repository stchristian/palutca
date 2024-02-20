import { string, tuple } from "yup";
import { notificationService } from "../notificationService.js";
import { messages } from "../botTexts.js";

export const handleUpdateSchedule = async (message, cmd, params) => {
  const [name, schedule] = params;
  const telegramUserId = message.from.id;

  const notificationId = notificationService.getNotificationId(name, telegramUserId);

  await notificationService.updateSchedule(notificationId, schedule);

  return messages.scheduleUpdatedSuccessfully;
};

handleUpdateSchedule.schema = tuple([
  string().label("name").required("Name is required"),
  string().label("schedule").required("Schedule is required"),
]);
