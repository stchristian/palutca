import { sendMessage } from "./telegramService.js";
import { handleScrape } from "./command-handlers/handleScrape.js";
import { handleRemove } from "./command-handlers/handleRemove.js";
import { handleHello } from "./command-handlers/handleHello.js";
import { handleUnknown } from "./command-handlers/handleUnknown.js";
import { handleList } from "./command-handlers/handleList.js";
import { handleStop } from "./command-handlers/handleStop.js";
import { handleResume } from "./command-handlers/handleResume.js";

// Creates a command object and validates params according to schema before passing it to the command handler
function createCommand(handler, paramsSchema) {
  return {
    handler: (message, command, params) => {
      if (paramsSchema) {
        paramsSchema.validateSync(params);
      }
      return handler(message, command, params);
    },
    paramsSchema,
  };
}

// Object that connects command names to the corresponding handlers
const commandMapObject = {
  "/hello": createCommand(handleHello),
  "/scrape": createCommand(handleScrape, handleScrape.schema),
  "/remove": createCommand(handleRemove, handleRemove.schema),
  "/stop": createCommand(handleStop, handleStop.schema),
  "/restart": createCommand(handleResume, handleResume.schema),
  // "/setcron": setCron,
  // "/setselector": setSelector,
  "/list": createCommand(handleList),
  // "/info": info,
};

function extractCommandAndParamsFromText(cmdEntity, text) {
  const indexOfCommandEnd = cmdEntity.offset + cmdEntity.length;
  const command = text.slice(cmdEntity.offset, indexOfCommandEnd);
  const params = splitParamList(text.slice(indexOfCommandEnd + 1));
  return { command, params };
}

export async function handleMessage(message) {
  console.log(`handleMessage() -- `);
  if (!message.entities) return false;

  const commandEntities = message.entities.filter(
    (entity) => entity.type === "bot_command"
  );

  await Promise.all(
    commandEntities.map(async (cmdEntity) => {
      const { command, params } = extractCommandAndParamsFromText(
        cmdEntity,
        message.text
      );
      if (command in commandMapObject) {
        try {
          const responseText = await commandMapObject[command].handler(
            message,
            command,
            params
          );
          if (responseText) {
            return sendMessage(message.chat.id, responseText);
          }
        } catch (error) {
          if (error.name === "ValidationError") {
            console.log(error);
            return sendMessage(message.chat.id, error.message);
          } else {
            throw error;
          }
        }
      } else {
        handleUnknown(message, command);
      }
    })
  );
}

function splitParamList(input) {
  // Match non-space characters or anything within double quotes
  const regex = /[^\s"]+|"([^"]*)"/g;
  const result = [];
  let match;

  do {
    // Each call to exec returns the next match or null if there are no more matches
    match = regex.exec(input);
    if (match != null) {
      // Use the captured group if it exists, otherwise use the whole match
      result.push(match[1] ? match[1] : match[0]);
    }
  } while (match !== null);

  return result;
}
