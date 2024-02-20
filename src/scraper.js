import * as cheerio from "cheerio";
import axios from "axios";
import { createHash } from "crypto";
import { sendMessage } from "./telegramService.js";
import { messages } from "./botTexts.js";
import { notificationService } from "./notificationService.js";

async function downloadHtmlByUrl(url) {
  console.log(`Download html from: ${url}`);
  const { data } = await axios.get(url);

  return data;
}

function extractTextContentFromHtml(html, selector) {
  const $ = cheerio.load(html);
  const text = $(selector).text();
  console.log(
    `Text content extracted from html using - ${selector} - as selector: ${text}`
  );
  return text;
}

function md5(content) {
  return createHash("md5").update(content).digest("hex");
}

function hashDidChange(oldHash, newHash) {
  return typeof oldHash !== "undefined" && oldHash !== newHash;
}

function shouldSaveNewHash(oldHash, newHash) {
  return typeof oldHash === "undefined" || oldHash !== newHash;
}

export async function checkContentChange(event) {
  const html = await downloadHtmlByUrl(event.url);
  const text = extractTextContentFromHtml(html, event.selector);

  const newHash = md5(text);
  const oldHash = await notificationService.getContentHashForNotification(
    event.id
  );

  console.log(`Old hash: ${oldHash}\nNew hash: ${newHash}`);

  if (hashDidChange(oldHash, newHash)) {
    await sendMessage(
      event.telegramChatId,
      messages.notifyUser(event.url, event.name)
    );
  }

  if (shouldSaveNewHash(oldHash, newHash)) {
    await notificationService.updateContentHashForNotification(
      event.id,
      newHash
    );
  }
}
