export const DEFAULT_QUICK_REACTIONS = ["❤️", "😂", "😮", "😢", "🙏", "👍"];

// a chat's own six win over the ones set in Settings, which in turn win over the defaults
export const quickReactionsOf = (user, conversation) =>
  [conversation?.quickReactions, user?.quickReactions, DEFAULT_QUICK_REACTIONS].find((choice) => choice?.length);

export const reactionsOf = (message, isForAlbum = false) => (isForAlbum ? message.albumReactions : message.reactions) ?? [];

export const myReactionOn = (message, userId, isForAlbum = false) => reactionsOf(message, isForAlbum).find((reaction) => reaction.user === userId)?.emoji;

const tallyReactions = (reactions = []) =>
  reactions.reduce((tally, { user, emoji }) => {
    const existing = tally.find((entry) => entry.emoji === emoji);
    if (existing) existing.users.push(user);
    else tally.push({ emoji, users: [user] });
    return tally;
  }, []);

export const rankedReactions = (reactions) => tallyReactions(reactions).sort((one, other) => other.users.length - one.users.length);
