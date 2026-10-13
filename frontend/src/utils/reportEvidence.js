import { filesOf } from "@/utils/messageFiles";

const AROUND = 5;
const EVIDENCE_LIMIT = AROUND * 2 + 1;

const asEvidence = (message, reportedId) => ({
  message: message._id,
  sender: message.sender?._id ?? message.sender,
  sentAt: message.createdAt,
  text: message.message ?? "",
  files: filesOf(message)
    .filter((file) => file.url)
    .map(({ url, key, iv, mimeType, name }) => ({ url, key, iv, mimeType, name })),
  isReported: message._id === reportedId,
  plaintext: message.plaintext,
});

const canBeSent = (message) => !message.event && !message.deletedAt && !message.undecryptable && !message.viewOnce;

// a reported message goes with what was said around it, and a whole chat goes with however it ended
export const evidenceAround = (messages, reportedId) => {
  const usable = messages.filter(canBeSent);
  const at = reportedId ? usable.findIndex((message) => message._id === reportedId) : -1;
  const window = at === -1 ? usable.slice(-EVIDENCE_LIMIT) : usable.slice(Math.max(0, at - AROUND), at + AROUND + 1);
  return window.map((message) => asEvidence(message, reportedId));
};
