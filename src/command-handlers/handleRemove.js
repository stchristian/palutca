import { ResourceNotFoundException } from "@aws-sdk/client-eventbridge";
import { string, tuple } from "yup";
import { messages } from "../botTexts.js";
import { deleteRule, removeTargets } from "../eventBridgeService.js";

export function getEventBridgeRuleName(name, userId) {
  return `${userId}-${name}`;
}

export async function handleRemove(message, cmd, params) {
  const [name] = params;

  const ruleName = getEventBridgeRuleName(name, message.from.id);
  console.log("Rule name: ", ruleName);

  try {
    const removeTargetsResponse = await removeTargets(ruleName);
    console.log("Remove targets response", removeTargetsResponse);
    const deleteRuleResponse = await deleteRule(ruleName);
    console.log("Delete rule response", deleteRuleResponse);
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
