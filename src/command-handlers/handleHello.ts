import { messages } from "../botTexts.js";
import { CommandHandler } from "../command.types.js";

export const handleHello: CommandHandler = (message, _cmd) => {
  const {
    from: { first_name: firstName, last_name: lastName },
  } = message;
  return messages.hello(firstName, lastName);
};
