import {
  EnableRuleCommand,
  EventBridgeClient,
  ListRulesCommand,
  ListTargetsByRuleCommand,
  RemoveTargetsCommand,
  DisableRuleCommand,
  PutRuleCommand,
  PutTargetsCommand,
  DeleteRuleCommand,
  DescribeRuleCommand,
  TagResourceCommand,
  ListTagsForResourceCommand,
} from "@aws-sdk/client-eventbridge";

/*
 * The
 */

class NotificationService {
  #client;
  #HashTagKey = "MD5HashOfFetchedTextContent";

  constructor() {
    this.#client = new EventBridgeClient({
      logger: console,
    });
  }

  getNotificationId(name, userId) {
    return `${userId}-${name}`;
  }

  disableNotification(id) {
    return this.#client.send(
      new DisableRuleCommand({
        Name: id,
      })
    );
  }

  async updateContentHashForNotification(id, hash) {
    const rule = await this.#getRule(id);

    return this.#client.send(
      new TagResourceCommand({
        ResourceARN: rule.Arn,
        Tags: [
          {
            Key: this.#HashTagKey,
            Value: hash,
          },
        ],
      })
    );
  }

  async getContentHashForNotification(id) {
    const rule = await this.#getRule(id);
    const tags = await this.#listTagsForRule(rule.Arn);

    const hash = tags?.find((tag) => tag.Key === this.#HashTagKey)?.Value;

    return hash;
  }

  enableNotification(id) {
    return this.#client.send(
      new EnableRuleCommand({
        Name: id,
      })
    );
  }

  async listNotifications(telegramUserId) {
    // Get rules for the specific user
    const response = await this.#client.send(
      new ListRulesCommand({
        NamePrefix: telegramUserId,
      })
    );

    const items = await Promise.all(
      response.Rules?.map(async (rule) => {
        const input = JSON.parse(
          (await this.#listTargetsByRule(rule.Name)).Targets[0]?.Input
        );
        return {
          ...input,
          state: rule.State,
        };
      })
    );
    return items;
  }

  async deleteNotification(id) {
    await this.#removeTargetsForRule(id);

    return this.#client.send(
      new DeleteRuleCommand({
        Name: id,
      })
    );
  }

  async createNotification(id, input) {
    await this.#client.send(
      new PutRuleCommand({
        Name: id,
        State: "ENABLED",
        ScheduleExpression: input.schedule,
      })
    );

    return this.#client.send(
      new PutTargetsCommand({
        Rule: id,
        Targets: [
          {
            Arn: process.env.SCRAPE_FUNCTION_ARN,
            Id: id,
            Input: JSON.stringify({ ...input, id }),
          },
        ],
      })
    );
  }

  async updateInputForNotification(id, partialInput) {
    const target = await this.#listTargetsByRule(id);
    const oldInput = JSON.parse(target.Targets[0]?.Input);

    return this.#client.send(
      new PutTargetsCommand({
        Rule: id,
        Targets: [
          {
            Arn: process.env.SCRAPE_FUNCTION_ARN,
            Id: id,
            Input: JSON.stringify({ ...oldInput, ...partialInput }),
          },
        ],
      })
    );
  }

  updateSchedule(id, schedule) {
    return this.#client.send(
      new PutRuleCommand({
        Name: id,
        ScheduleExpression: schedule,
      })
    );
  }

  async #listTagsForRule(arn) {
    const { Tags } = await this.#client.send(
      new ListTagsForResourceCommand({
        ResourceARN: arn,
      })
    );

    return Tags;
  }

  #getRule(ruleName) {
    return this.#client.send(
      new DescribeRuleCommand({
        Name: ruleName,
      })
    );
  }

  #listTargetsByRule(ruleName) {
    return this.#client.send(
      new ListTargetsByRuleCommand({
        Rule: ruleName,
      })
    );
  }

  #removeTargetsForRule(ruleName) {
    return this.#client.send(
      new RemoveTargetsCommand({
        Rule: ruleName,
        Ids: [ruleName],
      })
    );
  }
}

export const notificationService = new NotificationService();
