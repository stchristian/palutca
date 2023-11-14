import { ResourceNotFoundException } from "@aws-sdk/client-eventbridge";
import { string, tuple } from "yup";
import { messages } from "../botTexts.js";
import { getEventBridgeRuleName } from "./handleRemove.js";
import { enableRule } from "../eventBridgeService.js";

export async function handleResume(message, cmd, params) {
  const [name] = params;

  const ruleName = getEventBridgeRuleName(name, message.from.id);

  try {
    const response = enableRule(ruleName);
    console.log("Enable rule response", response);
    return messages.notificationResumedSuccessfully;
  } catch (error) {
    console.log(error);
    if (error instanceof ResourceNotFoundException) {
      return messages.notificationDoesNotExist(name);
    }
    return error.message;
  }
}

handleResume.schema = tuple([
  string().label("name").required("Name is required"),
]);
