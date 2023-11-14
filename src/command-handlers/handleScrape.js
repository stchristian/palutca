import { string, tuple } from "yup";
import { getEventBridgeRuleName } from "./handleRemove.js";
import { messages } from "../botTexts.js";
import { putRuleAndTarget } from "../eventBridgeService.js";

export async function handleScrape(message, cmd, params) {
  const [name, url, selector, schedule] = params;
  const telegramUserId = message.from.id;
  const ruleName = getEventBridgeRuleName(name, telegramUserId);

  await putRuleAndTarget(ruleName, {
    name,
    url,
    selector,
    schedule,
    telegramChatId: message.chat.id,
  });

  return messages.notificationSuccessfullySetUp;
}

handleScrape.schema = tuple([
  string("Name must be a simple text")
    .label("name")
    .required("Name is required"),
  string().url("The URL is not valid").label("url").required("URL is required"),
  string().label("selector").required("Selector is required"), // TODO this can be space delimited
  string().label("schedule").default("rate(12 hours)").optional(), // TODO This should be a cron or rate expression
]);
