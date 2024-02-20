import { Schema } from "yup";
import { TelegramMessage } from "./telegram";
import { ParsedCommand } from "./commandParser";

type CommandHandler = (
  message: TelegramMessage,
  parsedCommand: ParsedCommand
) => string;

interface Command {
  name: string;
  run: CommandHandler;
  paramsSchema?: Schema;
}

/**
 * Class to hold the list of commands of the Telegram BOT.
 */
export class CommandRegistry {
  private commands: Map<string, Command> = new Map();

  addCommand(name: string, handler: CommandHandler, paramsSchema: Schema) {
    if (this.commands.has(name)) {
      throw new Error(`Command ${name} does already exist`);
    }

    const newCommand: Command = this.createCommand(name, paramsSchema, handler);

    this.commands.set(newCommand.name, newCommand);
  }

  private createCommand(
    name: string,
    paramsSchema: Schema<any, any, any, "">,
    handler: CommandHandler
  ): Command {
    return {
      name,
      run: (message, parsedCommand) => {
        if (paramsSchema) {
          paramsSchema.validateSync(parsedCommand.params);
        }
        return handler(message, parsedCommand);
      },
      paramsSchema,
    };
  }

  get(name: string) {
    return this.commands.get(name);
  }

  contains(name: string) {
    return this.commands.has(name);
  }

  run(parsedCommand: ParsedCommand, message: TelegramMessage) {
    if (this.commands.has(parsedCommand.command))
      return this.commands
        .get(parsedCommand.command)!
        .run(message, parsedCommand);
  }
}
