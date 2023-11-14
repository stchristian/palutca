import { messages } from "../botTexts.js";
import { listRules, listTargetByRules } from "../eventBridgeService.js";

export async function handleList(message) {
  const telegramUserId = message.from.id;

  // Get rules for the specific user
  const result = await listRules(telegramUserId.toString());

  //Get input object of the target that corresponds to rule
  const items = await Promise.all(
    result.Rules?.map(async (rule) => {
      const input = JSON.parse(
        (await listTargetByRules(rule.Name)).Targets[0]?.Input
      );
      return input;
    })
  );
  console.log("Items: ", items);

  if (items.length === 0) {
    return messages.noNotifications;
  }

  return items.map(messages.toListItem).join("\n");
}
