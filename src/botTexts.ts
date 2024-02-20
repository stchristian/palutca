type Messages = {
  [key: string]: string | ((...args: any[]) => string);
};

export const messages: Messages = {
  noNotifications: "You haven't set up any notifications",
  toListItem: (item, index) =>
    `${index + 1}.\nName: ${item.name}\nUrl: ${item.url}\nSelector: ${item.selector}\nSchedule: ${
      item.schedule
    }\nState: ${item.state}`,

  hello: (firstName, lastName) => `Hello dear ${firstName} ${lastName}`,
  notificationSuccessfullySetUp: "The setup was successful. The notifications will appear in this chat conversation. ",
  notificationRemovedSuccessfully: "Successfully removed notification",
  notificationStoppedSuccessfully: "Successfully stopped notification. You can resume it later if you want",
  notificationResumedSuccessfully: "Successfully restarted notification",
  notificationDoesNotExist: (name) =>
    ` ${name} does not exist. Verify that you have typed it correctly or get a list of your notifications with the /list command`,
  unknownCommand: (cmd) => `Unknown command: ${cmd}`,
  notifyUser: (url, name) =>
    `Notification ${name}: The content of your site with the following url ${url} has changed. `,
  selectorUpdatedSuccessfully: "Selector has been updated successfully",
  scheduleUpdatedSuccessfully: "Schedule has been updated successfully",
};
