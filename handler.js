const { handleCommand } = require("./src/commandHandler");
const { getProgramme } = require("./src/palutca");
const { saveDates, getDates } = require("./src/programmeStore");
const { getSubscribers } = require("./src/subscriberService");
const { sendMessage } = require("./src/telegramService");
const { arrayEquals } = require("./src/utils");

module.exports.webhook = (event, context, callback) => {
  console.log(`webhook() -- event object: ${JSON.stringify(event)}`);
  const body = JSON.parse(event.body);

  handleCommand(body);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      input: event,
    }),
  };

  return callback(null, response);
};

module.exports.cronjob = async (event, context, callback) => {
  console.log(`cronjob() -- event object: ${JSON.stringify(event)}`);

  const oldDates = await getDates();
  const newDates = await getProgramme();

  console.log(`cronjob() -- \nOld dates: ${JSON.stringify(oldDates)}\nNew dates: ${JSON.stringify(newDates)}`);

  if (!arrayEquals(newDates, oldDates)) {
    console.log(`cronjob() -- there are new dates`);
    await saveDates(newDates);
    const subscribers = await getSubscribers();
    const message = `Hey! :)\nÚj időpontok a Pál utcai fiúk vetítésre:\n\n${newDates.join("\n")}`;
    await Promise.all(
      subscribers.map(({ chatId }) => {
        return sendMessage(chatId, message);
      })
    );
  } else {
    console.log(`cronjob() -- there are no new dates`);
  }
};
