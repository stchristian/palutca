import { messages } from "../botTexts.js";

export function handleHello(message, _cmd) {
  const {
    from: { first_name: firstName, last_name: lastName },
  } = message;
  return messages.hello(firstName, lastName);
}
