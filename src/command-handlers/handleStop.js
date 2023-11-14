import { ResourceNotFoundException } from "@aws-sdk/client-eventbridge";
import { string, tuple } from "yup";
import { messages } from "../botTexts.js";
import { getEventBridgeRuleName } from "./handleRemove.js";
import { disableRule } from "../eventBridgeService.js";

export async function handleStop(message, cmd, params) {
  const [name] = params;

  const ruleName = getEventBridgeRuleName(name, message.from.id);

  try {
    const response = disableRule(ruleName);
    console.log("Disable rule response", response);
    return messages.notificationStoppedSuccessfully;
  } catch (error) {
    console.log(error);
    if (error instanceof ResourceNotFoundException) {
      return messages.notificationDoesNotExist(name);
    }
    return error.message;
  }
}

handleStop.schema = tuple([
  string().label("name").required("Name is required"),
]);
