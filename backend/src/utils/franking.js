import crypto from "crypto";

const STRUCTURED = "\u0001";

const keyIn = (plaintext) => {
  if (!plaintext.startsWith(STRUCTURED)) return null;
  try {
    return JSON.parse(plaintext.slice(STRUCTURED.length)).franking ?? null;
  } catch {
    return null;
  }
};

// an attachment's payload is plain JSON, while a written message is marked as structured content
const frankingKeyIn = (plaintext) => {
  if (keyIn(plaintext)) return keyIn(plaintext);
  try {
    return JSON.parse(plaintext).franking ?? null;
  } catch {
    return null;
  }
};

// the key the sender sealed inside the message has to be the one that makes the fingerprint it sent in the clear
export const matchesFranking = (plaintext, franking) => {
  const key = typeof plaintext === "string" && frankingKeyIn(plaintext);
  if (!key || !franking) return false;

  const expected = crypto.createHmac("sha256", Buffer.from(key, "base64")).update(plaintext, "utf8").digest();
  const claimed = Buffer.from(franking, "base64");
  return expected.length === claimed.length && crypto.timingSafeEqual(expected, claimed);
};
