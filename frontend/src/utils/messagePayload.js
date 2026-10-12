// a control character nobody can type marks structured content, so messages written before it stay plain text
const STRUCTURED = "\u0001";

export const encodePayload = ({ text = "", mentions, contact, statusQuote, emojiScale }) =>
  mentions?.length || contact || statusQuote || emojiScale
    ? STRUCTURED + JSON.stringify({ text, mentions, contact, statusQuote, emojiScale })
    : text;

export const decodePayload = (plaintext) => {
  if (!plaintext.startsWith(STRUCTURED)) return { text: plaintext };
  try {
    return JSON.parse(plaintext.slice(STRUCTURED.length));
  } catch {
    return { text: "" };
  }
};
