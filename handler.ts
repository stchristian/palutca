import telegramUpdateController, {
  handleMessage,
} from "./src/telegramUpdateController.js";
import { checkContentChange } from "./src/scraper.js";
import { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { TelegramUpdate } from "./src/telegram.js";

export const ping: APIGatewayProxyHandlerV2 = async (event, context) => {
  console.log("ENVIRONMENT VARIABLES COMING::");
  console.log(process.env);
  return buildSuccessResponse();
};

/*
 * Webhook function that is called by telegram api to handle the commands/updates coming from the users
 */
export const webhook: APIGatewayProxyHandlerV2 = async (event) => {
  console.log(`event: ${event}`);
  const body = JSON.parse(event.body!) as TelegramUpdate;

  await telegramUpdateController.process(body);

  return buildSuccessResponse();
};

export async function scraper(event, context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  await checkContentChange(event);
  return context.logStreamName;
}

function buildSuccessResponse(): APIGatewayProxyResultV2 {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "ok",
    }),
    headers: { "Content-Type": "application/json" },
  };
}
