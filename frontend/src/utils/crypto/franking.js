import { fromBase64, toBase64 } from "@/utils/crypto/encoding";

const HMAC = { name: "HMAC", hash: "SHA-256" };
const KEY_BYTES = 32;

export const frankingKey = () => toBase64(crypto.getRandomValues(new Uint8Array(KEY_BYTES)));

// the key travels sealed inside the message and the fingerprint travels in the clear, so neither alone says anything
export const frankingOf = async (key, plaintext) => {
  const signing = await crypto.subtle.importKey("raw", fromBase64(key), HMAC, false, ["sign"]);
  return toBase64(await crypto.subtle.sign("HMAC", signing, new TextEncoder().encode(plaintext)));
};
