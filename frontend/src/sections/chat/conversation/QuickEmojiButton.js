import { useEffect, useRef, useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";

import { MAX_EMOJI_SCALE } from "@/utils/emoji";
import { startRisingTone } from "@/utils/sounds";

const HOLD_MS = 220;
const GROW_MS = 900;

const QuickEmojiButton = ({ emoji, buttonSx, onSend }) => {
  const [scale, setScale] = useState(1);
  const holdTimer = useRef(null);
  const frame = useRef(null);
  const reached = useRef(1);
  const wasHeld = useRef(false);
  const stopTone = useRef(null);

  const silence = () => {
    stopTone.current?.();
    stopTone.current = null;
  };

  const stop = () => {
    clearTimeout(holdTimer.current);
    cancelAnimationFrame(frame.current);
    silence();
    reached.current = 1;
    setScale(1);
  };

  useEffect(
    () => () => {
      clearTimeout(holdTimer.current);
      cancelAnimationFrame(frame.current);
      stopTone.current?.();
    },
    []
  );

  const grow = (startedAt) => {
    const part = Math.min((performance.now() - startedAt) / GROW_MS, 1);
    reached.current = 1 + part * (MAX_EMOJI_SCALE - 1);
    setScale(reached.current);
    if (part < 1) frame.current = requestAnimationFrame(() => grow(startedAt));
  };

  const press = () => {
    wasHeld.current = false;
    holdTimer.current = setTimeout(() => {
      stopTone.current = startRisingTone(GROW_MS);
      grow(performance.now());
    }, HOLD_MS);
  };

  // letting go after a hold sends the size it grew to, and the click that follows must not send a second
  const release = () => {
    if (reached.current > 1) {
      wasHeld.current = true;
      onSend(Math.round(reached.current * 100) / 100);
    }
    stop();
  };

  const tap = () => {
    if (wasHeld.current) wasHeld.current = false;
    else onSend(1);
  };

  const label = `Send ${emoji}, hold to send it bigger`;

  return (
    <Box sx={{ position: "relative" }}>
      {scale > 1 && (
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            left: "50%",
            bottom: "100%",
            mb: 1,
            fontSize: 28,
            lineHeight: 1,
            pointerEvents: "none",
            transformOrigin: "bottom center",
            transform: `translateX(-50%) scale(${scale})`,
          }}
        >
          {emoji}
        </Box>
      )}
      <Tooltip title={label}>
        <IconButton
          aria-label={label}
          onPointerDown={press}
          onPointerUp={release}
          onPointerLeave={stop}
          onPointerCancel={stop}
          onClick={tap}
          sx={{ fontSize: 24, ...buttonSx, touchAction: "none" }}
        >
          {emoji}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default QuickEmojiButton;
