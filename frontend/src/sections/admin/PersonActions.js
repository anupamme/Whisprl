import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

import useIsLoading from "@/hooks/useIsLoading";
import { BanPerson, RestorePerson, SuspendPerson } from "@/redux/slices/actions/adminActions";
import { statusOf } from "@/sections/admin/PersonStatus";

const SUSPEND_DAYS = [1, 7, 30];

const ACTIONS = {
  suspend: {
    thunk: SuspendPerson,
    title: (name) => `Suspend ${name}?`,
    explanation: "They can't log in until the suspension ends, and their open sessions close now.",
    verb: "Suspend",
    needsLength: true,
  },
  ban: {
    thunk: BanPerson,
    title: (name) => `Ban ${name}?`,
    explanation: "They can't log in again, their open sessions close now, and everyone else sees a deleted account in their place.",
    verb: "Ban",
    isDanger: true,
  },
  restore: {
    thunk: RestorePerson,
    title: (name) => `Give ${name} access back?`,
    explanation: "They can log in again, and their name and photo come back for everyone else.",
    verb: "Give access back",
  },
};

const ActionDialog = ({ action, person, reportId, onClose, onDone }) => {
  const dispatch = useDispatch();
  const [reason, setReason] = useState("");
  const [days, setDays] = useState(SUSPEND_DAYS[1]);
  const isWorking = useIsLoading(action.thunk);

  const act = async () => {
    const details = { userId: person._id, reason, reportId, ...(action.needsLength && { until: dayjs().add(days, "day").toISOString() }) };
    const result = await dispatch(action.thunk(details));
    if (!action.thunk.fulfilled.match(result)) return;
    onClose();
    onDone();
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{action.title(`${person.firstName} ${person.lastName}`)}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontSize: 14.5 }}>{action.explanation}</DialogContentText>
        {action.needsLength && (
          <TextField
            select
            fullWidth
            SelectProps={{ native: true }}
            label="For how long"
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            sx={{ mt: 2.5 }}
          >
            {SUSPEND_DAYS.map((count) => (
              <option key={count} value={count}>
                {count === 1 ? "1 day" : `${count} days`}
              </option>
            ))}
          </TextField>
        )}
        <TextField
          fullWidth
          multiline
          minRows={2}
          label="Why"
          placeholder="This goes in the audit log"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          sx={{ mt: 2.5 }}
        />
        <DialogContentText sx={{ mt: 2, fontSize: 13 }}>Your passkey is asked for next.</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton variant="contained" color={action.isDanger ? "error" : "primary"} loading={isWorking} disabled={!reason.trim()} onClick={act}>
          {action.verb}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const PersonActions = ({ person, reportId, onDone }) => {
  const [kind, setKind] = useState(null);
  const status = statusOf(person);

  return (
    <>
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
        {status === "banned" || status === "suspended" ? (
          <Button size="small" variant="outlined" color="inherit" onClick={() => setKind("restore")}>
            Give access back
          </Button>
        ) : (
          <Button size="small" variant="outlined" color="inherit" onClick={() => setKind("suspend")}>
            Suspend
          </Button>
        )}
        {status !== "banned" && (
          <Button size="small" variant="outlined" color="error" onClick={() => setKind("ban")}>
            Ban
          </Button>
        )}
      </Stack>

      {kind && <ActionDialog action={ACTIONS[kind]} person={person} reportId={reportId} onClose={() => setKind(null)} onDone={onDone} />}
    </>
  );
};

export default PersonActions;
