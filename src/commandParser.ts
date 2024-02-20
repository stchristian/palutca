import { splitParamList } from "./splitParams";
import { TelegramMessageEntity } from "./telegram";

export type ParsedCommand = {
  command: string;
  params: string[];
};

export function parseCommandsFromMessageEntities(
  entities: TelegramMessageEntity[],
  text: string
) {
  return entities
    .filter((entity) => entity.type === "bot_command")
    .map((entity) => extractCommandAndParamsFromText(entity, text));
}

function extractCommandAndParamsFromText(
  cmdEntity: TelegramMessageEntity,
  text: string
): ParsedCommand {
  const indexOfCommandEnd = cmdEntity.offset + cmdEntity.length;
  const command = text.slice(cmdEntity.offset, indexOfCommandEnd);
  const params = splitParamList(text.slice(indexOfCommandEnd + 1));
  return { command, params };
}
