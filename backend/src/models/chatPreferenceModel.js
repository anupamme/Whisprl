import mongoose from "mongoose";

// what one person chose for one chat, kept apart from the conversation so no other member ever receives it
const chatPreferenceSchema = mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  conversation: { type: mongoose.Schema.ObjectId, ref: "Conversation", required: true },
  mutedUntil: { type: Date },
  isFavourite: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  clearedAt: { type: Date },
  // hidden from this person's list until a message newer than this arrives
  deletedAt: { type: Date },
  // the emoji the composer button sends in this chat
  quickEmoji: { type: String },
  // the six offered when reacting here, overriding the ones set in Settings
  quickReactions: { type: [String], default: undefined },
});

chatPreferenceSchema.index({ user: 1, conversation: 1 }, { unique: true });

const ChatPreferenceModel = mongoose.model("ChatPreference", chatPreferenceSchema);

export default ChatPreferenceModel;
