import {
  EnableRuleCommand,
  EventBridgeClient,
  ListRulesCommand,
  ListTargetsByRuleCommand,
  RemoveTargetsCommand,
  PutRuleCommand,
  PutTargetsCommand,
} from "@aws-sdk/client-eventbridge";

export const eventBridgeClient = new EventBridgeClient();

export function disableRule(ruleName) {
  return client.send(
    new DisableRuleCommand({
      Name: ruleName,
    })
  );
}

export function enableRule(ruleName) {
  return client.send(
    new EnableRuleCommand({
      Name: ruleName,
    })
  );
}

export function listRules(prefix) {
  // Get rules for the specific user
  return client.send(
    new ListRulesCommand({
      NamePrefix: prefix,
    })
  );
}

export function listTargetByRules(ruleName) {
  return client.send(
    new ListTargetsByRuleCommand({
      Rule: ruleName,
    })
  );
}

export function removeTargets(ruleName) {
  return client.send(
    new RemoveTargetsCommand({
      Rule: ruleName,
      Ids: [ruleName],
    })
  );
}

export function deleteRule(ruleName) {
  return client.send(
    new DeleteRuleCommand({
      Name: ruleName,
    })
  );
}

export async function putRuleAndTarget(ruleName, params) {
  const putRuleResponse = await client.send(
    new PutRuleCommand({
      Name: ruleName,
      State: "ENABLED",
      ScheduleExpression: params.schedule,
    })
  );

  console.log("PutRule response:");
  console.log(putRuleResponse);

  const putTargetsResponse = await client.send(
    new PutTargetsCommand({
      Rule: ruleName,
      Targets: [
        {
          Arn: process.env.SCRAPE_FUNCTION_ARN,
          Id: ruleName,
          Input: JSON.stringify({ ...params, ruleName }),
        },
      ],
    })
  );

  console.log("PutTargets response:");
  console.log(putTargetsResponse);
}
