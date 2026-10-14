import { MAX_EMOJI_SCALE, bareEmojiSizeOf, emojiScaleOf } from "@/utils/emoji";

test("one emoji reads largest and five the smallest", () => {
  expect(bareEmojiSizeOf("😺")).toBe(52);
  expect(bareEmojiSizeOf("😺😺😺😺😺")).toBe(30);
  expect(bareEmojiSizeOf("😺😺😺")).toBeLessThan(bareEmojiSizeOf("😺😺"));
});

test("more than five keeps its bubble", () => {
  expect(bareEmojiSizeOf("😺😺😺😺😺😺")).toBeUndefined();
});

test("emoji built from several code points count as one", () => {
  expect(bareEmojiSizeOf("👍🏽")).toBe(52);
  expect(bareEmojiSizeOf("❤️")).toBe(52);
  expect(bareEmojiSizeOf("👩‍👩‍👧‍👦")).toBe(52);
  expect(bareEmojiSizeOf("🇮🇳")).toBe(52);
});

test("spaces between emoji are ignored", () => {
  expect(bareEmojiSizeOf(" 😺 😹 ")).toBe(44);
});

test("anything other than emoji keeps its bubble", () => {
  expect(bareEmojiSizeOf("hi 😺")).toBeUndefined();
  expect(bareEmojiSizeOf("123")).toBeUndefined();
  expect(bareEmojiSizeOf("")).toBeUndefined();
  expect(bareEmojiSizeOf(undefined)).toBeUndefined();
});

test("a scale from another browser is held to what the button can reach", () => {
  expect(emojiScaleOf(undefined)).toBe(1);
  expect(emojiScaleOf(2)).toBe(2);
  expect(emojiScaleOf(99)).toBe(MAX_EMOJI_SCALE);
  expect(emojiScaleOf(-4)).toBe(1);
});
