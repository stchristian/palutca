const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const getSubscribers = async () => {
  try {
    const result = await s3
      .getObject({
        Bucket: process.env.BUCKET,
        Key: process.env.SUBSCRIBER_KEY,
      })
      .promise();

    const subscribers = JSON.parse(result.Body.toString("utf-8"));
    console.log(`getSubscribers() -- Subscribers: ${result.Body.toString("utf-8")}`);
    return subscribers;
  } catch (e) {
    // This error is caused probably by missing object
    console.error(`getSubcribers() -- Error: ${e}`);
    return [];
  }
};

const saveSubscribers = async (subscribers) => {
  console.log(`saveSubscribers() -- ${JSON.stringify(subscribers)}`);
  return s3
    .putObject({
      Bucket: process.env.BUCKET,
      Key: process.env.SUBSCRIBER_KEY,
      Body: JSON.stringify(subscribers),
    })
    .promise();
};

const subscribe = async (chatId) => {
  console.log(`subscribe() -- chatId: ${chatId}`);
  const currentSubscribers = await getSubscribers();
  if (!currentSubscribers.find((sub) => sub.chatId === chatId)) {
    return currentSubscribers;
  }
  const newSubcribers = [...currentSubscribers, { chatId, subscriptionDate: new Date().toISOString() }];
  await saveSubscribers(newSubcribers);
  return newSubcribers;
};

const unsubscribe = async (chatId) => {
  console.log(`unsubscribe() -- chatId: ${chatId}`);
  const subscribers = await getSubscribers();
  const deleteIndex = subscribers.findIndex((sub) => sub.chatId === chatId);
  console.log(`unsubscribe() -- deleteIndex: ${deleteIndex}`);
  if (deleteIndex !== -1) {
    subscribers.splice(deleteIndex, 1);
    await saveSubscribers(subscribers);
  }
  return subscribers;
};

module.exports = {
  subscribe,
  unsubscribe,
  getSubscribers,
};
