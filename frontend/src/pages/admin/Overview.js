import { useCallback, useEffect, useState } from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";

import useIsLoading from "@/hooks/useIsLoading";
import { GetOverview } from "@/redux/slices/actions/adminActions";
import DailyChart from "@/sections/admin/DailyChart";
import DateRangePicker from "@/sections/admin/DateRangePicker";
import { PRESETS, lastDays, presetOf } from "@/sections/admin/dayRanges";
import Notice from "@/sections/admin/Notice";
import OverviewFigures from "@/sections/admin/OverviewFigures";
import PillGroup from "@/sections/admin/PillGroup";

const Overview = () => {
  const dispatch = useDispatch();
  const overview = useSelector((state) => state.admin.overview);
  const isLoading = useIsLoading(GetOverview);
  const [range, setRange] = useState(() => lastDays(30));
  const [hasFailed, setHasFailed] = useState(false);

  const read = useCallback(() => dispatch(GetOverview(range)).then((result) => setHasFailed(GetOverview.rejected.match(result))), [dispatch, range]);

  useEffect(() => {
    read();
  }, [read]);

  const preset = presetOf(range);

  const body = () => {
    if (!overview && hasFailed) {
      return (
        <Box>
          <Notice title="The overview didn't load">Check your connection and try again.</Notice>
          <LoadingButton variant="contained" loading={isLoading} onClick={read} sx={{ mt: 2 }}>
            Try again
          </LoadingButton>
        </Box>
      );
    }
    if (!overview) return <CircularProgress size={28} aria-label="Loading the overview" sx={{ mt: 5 }} />;

    return (
      <>
        <OverviewFigures totals={overview.totals} active={overview.active} />

        <Stack direction="row" alignItems="flex-end" justifyContent="space-between" flexWrap="wrap" sx={{ mt: 6, gap: 1.5 }}>
          <Box>
            <Typography component="h2" sx={{ m: 0, fontSize: 20, fontWeight: 800 }}>
              Day by day
            </Typography>
            <Typography sx={{ mt: 0.25, fontSize: 13, color: "text.secondary" }}>Days run midnight to midnight UTC.</Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretch", sm: "center" }} flexWrap="wrap" sx={{ gap: 1, width: { xs: "100%", sm: "auto" } }}>
            <PillGroup
              label="Days shown"
              options={PRESETS.map(({ label }) => ({ value: label, label }))}
              value={preset?.label ?? null}
              onChange={(label) => setRange(PRESETS.find((each) => each.label === label).rangeOf())}
            />
            <DateRangePicker value={range} isCustom={!preset} onChange={setRange} />
          </Stack>
        </Stack>

        <Box
          sx={{
            mt: 3,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: { xs: 5, lg: 6 },
            opacity: isLoading ? 0.5 : 1,
            transition: "opacity 160ms ease",
          }}
        >
          <DailyChart
            title="Active people"
            total={overview.range.active}
            totalLabel="opened Whisprl in these days"
            emptyLabel="Nobody opened Whisprl in these days."
            data={overview.daily}
            dataKey="active"
            unit="active"
          />
          <DailyChart
            title="New people"
            total={overview.range.signups}
            totalLabel="joined in these days"
            emptyLabel="Nobody joined in these days."
            data={overview.daily}
            dataKey="signups"
            unit="joined"
            isBars
          />
        </Box>
      </>
    );
  };

  return (
    <Stack sx={{ maxWidth: 1200, px: { xs: 2, md: 6 }, py: { xs: 3, md: 6 } }}>
      <Typography component="h1" sx={{ m: 0, fontSize: { xs: 26, md: 32 }, fontWeight: 800, letterSpacing: "-0.02em" }}>
        Overview
      </Typography>
      <Typography sx={{ mt: 1, maxWidth: 560, fontSize: 15, color: "text.secondary", textWrap: "balance" }}>
        How many people use Whisprl, and how much. Message contents stay encrypted, so only counts are shown here.
      </Typography>
      {body()}
    </Stack>
  );
};

export default Overview;
