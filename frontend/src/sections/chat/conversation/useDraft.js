import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { setDraft } from "@/redux/slices/chatSlice";

const DRAFT_PAUSE = 400;

// a draft reaches the store once typing pauses, so a long conversation is not rebuilt on every keystroke
export const useDraft = (conversationId) => {
  const dispatch = useDispatch();
  const timer = useRef(null);
  const pending = useRef(null);

  const save = (text) => {
    clearTimeout(timer.current);
    pending.current = null;
    dispatch(setDraft({ conversationId, text }));
  };

  const noteDraft = (text) => {
    pending.current = text;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => save(text), DRAFT_PAUSE);
  };

  const clearDraft = () => save("");

  // leaving the chat mid-sentence still keeps what was typed
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      if (pending.current !== null) dispatch(setDraft({ conversationId, text: pending.current }));
    },
    [conversationId, dispatch]
  );

  return { noteDraft, clearDraft };
};
