import telegramService from "./telegramService.js";
import { handleScrape } from "./command-handlers/handleScrape.js";
import { handleRemove } from "./command-handlers/handleRemove.js";
import { handleHello } from "./command-handlers/handleHello.js";
import { handleUnknown } from "./command-handlers/handleUnknown.js";
import { handleList } from "./command-handlers/handleList.js";
import { handleStop } from "./command-handlers/handleStop.js";
import { handleResume } from "./command-handlers/handleResume.js";
import { handleUpdateSelector } from "./command-handlers/handleUpdateSelector.js";
import { handleUpdateSchedule } from "./command-handlers/handleUpdateSchedule.js";
import { TelegramMessage, TelegramUpdate } from "./telegram.js";
import { Schema } from "yup";
import { ParsedCommand, parseCommandsFromMessageEntities } from "./commandParser.js";
import { Command, CommandHandler } from "./command.types.js";

// Creates a command object and validates params according to schema before passing it to the command handler
function createCommand(handler: CommandHandler, paramsSchema?: Schema): Command {
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

// Object that connects telegram command names to the corresponding handlers
const commandMapObject: {
  [cmdName: string]: Command;
} = {
  "/hello": createCommand(handleHello),
  "/scrape": createCommand(handleScrape, handleScrape.schema),
  "/remove": createCommand(handleRemove, handleRemove.schema),
  "/stop": createCommand(handleStop, handleStop.schema),
  "/restart": createCommand(handleResume, handleResume.schema),
  "/setschedule": createCommand(handleUpdateSchedule, handleUpdateSchedule.schema),
  "/setselector": createCommand(handleUpdateSelector, handleUpdateSelector.schema),
  "/list": createCommand(handleList),
};

class TelegramUpdateController {
  async process(update: TelegramUpdate) {
    if (update.message) {
      await this.handleMessage(update.message);
    }
  }

  private async handleMessage(message: TelegramMessage) {
    console.log(`handleMessage() -- `);
    if (!message.entities) return;

    const parsedCommands = parseCommandsFromMessageEntities(message.entities!, message.text!);

    await Promise.all(
      parsedCommands.map(async (parsedCommand) => {
        if (parsedCommand.command in commandMapObject) {
          const responseText = await this.runCommand(parsedCommand, message);
          return telegramService.sendMessage(message.chat.id, responseText);
        } else {
          handleUnknown(message, parsedCommand.command);
        }
      })
    );
  }

  private runCommand(cmd: ParsedCommand, message: TelegramMessage) {
    try {
      return commandMapObject[cmd.command].handler(message, cmd.command, cmd.params);
    } catch (error) {
      if (error.name === "ValidationError") {
        console.log(error);
        return error.message;
      } else {
        throw error;
      }
    }
  }
}

export default new TelegramUpdateController();
