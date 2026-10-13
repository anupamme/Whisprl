import "dotenv/config";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

import { UserModel } from "#src/models/index.js";
import rebrandMail from "#src/templates/mail/rebrand.js";

// the name was still TwinkConnect for anyone who signed up before this
const RENAMED_ON = new Date("2026-10-04T00:00:00.000Z");
const SUBJECT = "TwinkConnect is now Whisprl";
const REPLY_TO = "whisprlai@gmail.com";
const SENT_LOG = path.join(process.cwd(), ".rebrand-sent.log");
const GAP_MS = 4000;

const flags = new Set(process.argv.slice(2).filter((arg) => arg.startsWith("--")));
const valueOf = (name, fallback) => {
  const found = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  return found ? Number(found.split("=")[1]) : fallback;
};

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// spam reports have to land on the campaign account, never on the one that sends codes and reset links
const transportOrQuit = () => {
  const user = process.env.CAMPAIGN_MAIL_USER;
  const pass = process.env.CAMPAIGN_MAIL_PASS;
  if (!user || !pass) {
    console.error("Set CAMPAIGN_MAIL_USER and CAMPAIGN_MAIL_PASS. This never sends from the account that sends codes.");
    process.exit(1);
  }
  return {
    transporter: nodemailer.createTransport({ service: "gmail", auth: { user, pass } }),
    from: `Whisprl (formerly TwinkConnect) <${user}>`,
  };
};

const alreadySent = () => new Set(fs.existsSync(SENT_LOG) ? fs.readFileSync(SENT_LOG, "utf8").split("\n").filter(Boolean) : []);

const deliver = async ({ transporter, from }, person) => {
  const mail = rebrandMail(person.firstName);
  await transporter.sendMail({
    from,
    to: person.email,
    replyTo: REPLY_TO,
    subject: SUBJECT,
    html: mail.html,
    text: mail.text,
    headers: { "List-Unsubscribe": `<mailto:${REPLY_TO}?subject=stop>` },
  });
};

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const recipients = await UserModel.find({ verified: true, createdAt: { $lt: RENAMED_ON } })
    .select("firstName email")
    .sort({ createdAt: 1 })
    .lean();

  const sent = alreadySent();
  const waiting = recipients.filter((person) => !sent.has(String(person._id)));
  console.log(`${recipients.length} verified accounts from before the rename, ${sent.size} already emailed, ${waiting.length} waiting.`);

  if (flags.has("--test")) {
    const owner = await UserModel.findOne({ email: process.env.OWNER_EMAIL }).select("firstName email").lean();
    if (!owner) throw new Error("OWNER_EMAIL matches no account, so there is nobody to test on");
    await deliver(transportOrQuit(), owner);
    console.log("Test copy sent to the owner. Read it on a phone and a computer before sending the rest.");
    return;
  }

  if (!flags.has("--send")) {
    console.log("Dry run. Nothing was sent. Pass --test for a copy to the owner, then --send for the rest.");
    return;
  }

  const batch = waiting.slice(0, valueOf("limit", 450));
  const mailer = transportOrQuit();
  console.log(`Sending to ${batch.length}, one every ${GAP_MS / 1000}s. Stops on the first error.`);

  let done = 0;
  for (const person of batch) {
    await deliver(mailer, person);
    fs.appendFileSync(SENT_LOG, `${person._id}\n`);
    done += 1;
    if (done % 25 === 0 || done === batch.length) console.log(`  ${done}/${batch.length}`);
    if (done < batch.length) await pause(GAP_MS);
  }
  console.log(`Done. ${waiting.length - done} still waiting; run again tomorrow to carry on.`);
};

run()
  .catch((error) => {
    console.error(`Stopped: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
