import { handleMessage } from "./src/commandHandler.js";
import { checkContentChange } from "./src/scraper.js";

export function ping(event) {
  console.log("ENVIRONMENT VARIABLES COMING::");
  console.log(process.env);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v3.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
}

/* Webhook function that is called by telegram api to handle the commands/updates coming from the users*/
export async function webhook(event, context, callback) {
  console.log(`event: ${event}`);
  const body = JSON.parse(event.body);
  console.log(`event.body: ${JSON.stringify(body)}`);

  if (body.message) {
    await handleMessage(body.message);
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "ok",
    }),
    headers: { "Content-Type": "application/json" },
  };

  return callback(null, response);
}

export async function scraper(event, context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  await checkContentChange(event);
  return context.logStreamName;
}

// module.exports.cronjob = async (event, context, callback) => {
//   console.log(`cronjob() -- event object: ${JSON.stringify(event)}`);

//   const oldDates = await getDates();
//   const newDates = await getProgramme();

//   console.log(`cronjob() -- \nOld dates: ${JSON.stringify(oldDates)}\nNew dates: ${JSON.stringify(newDates)}`);

//   if (!arrayEquals(newDates, oldDates)) {
//     console.log(`cronjob() -- there are new dates`);
//     await saveDates(newDates);
//     const subscribers = await getSubscribers();
//     const message = `Hey! :)\nÚj időpontok a Pál utcai fiúk vetítésre:\n\n${newDates.join("\n")}`;
//     await Promise.all(
//       subscribers.map(({ chatId }) => {
//         return sendMessage(chatId, message);
//       })
//     );
//   } else {
//     console.log(`cronjob() -- there are no new dates`);
//   }
// };
