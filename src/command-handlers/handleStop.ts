import { ResourceNotFoundException } from "@aws-sdk/client-eventbridge";
import { string, tuple } from "yup";
import { messages } from "../botTexts.js";
import { notificationService } from "../notificationService.js";

export const handleStop = async (message, cmd, params) => {
  const [name] = params;

  const notificationId = notificationService.getNotificationId(name, message.from.id);

  try {
    await notificationService.disableNotification(notificationId);

    return messages.notificationStoppedSuccessfully;
  } catch (error) {
    if (error instanceof ResourceNotFoundException) {
      return messages.notificationDoesNotExist(name);
    }
    return error.message;
  }
};

handleStop.schema = tuple([string().label("name").required("Name is required")]);
