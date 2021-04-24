const { sendMessage } = require("./telegramService");
const { getProgramme } = require("./palutca");
const { subscribe, unsubscribe, getSubscribers } = require("./subscriberService");

const handleCommand = async (requestBody) => {
  console.log(`handleCommand() -- `);
  const message = requestBody.message;
  if (!message.entities) return false;
  let command = "";
  message.entities.forEach((entity) => {
    if (entity.type === "bot_command") {
      command = message.text;
    }
  });
  const {
    chat: { id: chatId },
    from: { first_name: firstName, last_name: lastName },
  } = message;
  switch (command) {
    case "/hello":
      sendMessage(chatId, `Hello dear ${firstName} ${lastName}`);
      return true;
    case "/palutca":
      const programme = await getProgramme();
      sendMessage(chatId, programme.join("\n"));
      return true;
    case "/subscribe":
      await subscribe(chatId);
      return true;
    case "/unsubscribe":
      await unsubscribe(chatId);
      return true;
    case "/subscribers":
      const subscribers = await getSubscribers();
      sendMessage(chatId, JSON.stringify(subscribers));
      return true;
    default:
      sendMessage(chatId, "Can not recognize this command.");
      return false;
  }
};

module.exports = {
  handleCommand,
};
