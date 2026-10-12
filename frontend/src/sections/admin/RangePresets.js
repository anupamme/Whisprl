import { Box, ButtonBase } from "@mui/material";
import { alpha } from "@mui/material/styles";

import { PRESETS } from "@/sections/admin/dayRanges";

const RangePresets = ({ current, onChoose }) => (
  <Box role="group" aria-label="Days shown" sx={{ display: "grid", gap: 1, gridTemplateColumns: { xs: "1fr 1fr", sm: `repeat(${PRESETS.length}, auto)` } }}>
    {PRESETS.map((preset) => {
      const isCurrent = preset.label === current?.label;
      return (
        <ButtonBase
          key={preset.label}
          aria-pressed={isCurrent}
          onClick={() => onChoose(preset.rangeOf())}
          sx={{
            px: 1.5,
            height: 36,
            borderRadius: 2,
            border: 1,
            fontSize: 13.5,
            fontWeight: 700,
            whiteSpace: "nowrap",
            borderColor: isCurrent ? "primary.main" : "divider",
            color: isCurrent ? "primary.main" : "text.secondary",
            bgcolor: isCurrent ? (theme) => alpha(theme.palette.primary.main, 0.12) : "transparent",
            "&:hover": { borderColor: isCurrent ? "primary.main" : "text.secondary" },
            "&.Mui-focusVisible": { outline: 2, outlineColor: "primary.main" },
          }}
        >
          {preset.label}
        </ButtonBase>
      );
    })}
  </Box>
);

export default RangePresets;
