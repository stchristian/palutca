import { ResourceNotFoundException } from "@aws-sdk/client-eventbridge";
import { string, tuple } from "yup";
import { messages } from "../botTexts.js";
import { notificationService } from "../notificationService.js";

export async function handleRemove(message, cmd, params) {
  const [name] = params;

  const notificationId = notificationService.getNotificationId(
    name,
    message.from.id
  );

  try {
    await notificationService.deleteNotification(notificationId);

    return messages.notificationRemovedSuccessfully;
  } catch (error) {
    console.log(error);
    if (error instanceof ResourceNotFoundException) {
      return messages.notificationDoesNotExist(name);
    }
    return error.message;
  }
}

handleRemove.schema = tuple([
  string().label("name").required("Name is required"),
]);
