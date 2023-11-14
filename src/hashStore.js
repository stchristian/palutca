import {
  EventBridgeClient,
  DescribeRuleCommand,
  ListTagsForResourceCommand,
  TagResourceCommand,
} from "@aws-sdk/client-eventbridge";

const client = new EventBridgeClient();

const HashTagKey = "MD5HashOfFetchedTextContent";

async function getRule(ruleName) {
  console.log(`Describe rule ${ruleName}`);
  const res = await client.send(
    new DescribeRuleCommand({
      Name: ruleName,
    })
  );
  console.log(`Response: ${JSON.stringify(res, null, 2)}`);
  return res;
}

export async function getTextHashForRule(ruleName) {
  const rule = await getRule(ruleName);

  console.log(`List tags for ${ruleName}`);
  const { Tags } = await client.send(
    new ListTagsForResourceCommand({
      ResourceARN: rule.Arn,
    })
  );

  console.log(`Tags: ${JSON.stringify(Tags)}`);
  const hash = Tags.find((tag) => tag.Key === HashTagKey)?.Value;

  return hash;
}

export async function saveHashForRule(ruleName, hash) {
  const rule = await getRule(ruleName);

  console.log(`Setting the hash ${hash} for ${ruleName}`);

  const response = await client.send(
    new TagResourceCommand({
      ResourceARN: rule.Arn,
      Tags: [
        {
          Key: HashTagKey,
          Value: hash,
        },
      ],
    })
  );
  console.log(`Response: ${JSON.stringify(response)}`);
}
