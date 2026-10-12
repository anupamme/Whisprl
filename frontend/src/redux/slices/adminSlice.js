import { createSlice } from "@reduxjs/toolkit";

import { GetAuditLog } from "@/redux/slices/actions/adminActions";
import { logout } from "@/redux/slices/userSlice";

const initialState = {
  // entries stay null until the first page arrives, so an empty log is told apart from one not read yet
  audit: { entries: null, hasMore: false },
};

const slice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(GetAuditLog.fulfilled, (state, action) => {
        const { entries, hasMore } = action.payload;
        // a page asked for without a starting point is the newest, so it replaces whatever was shown
        state.audit = { entries: action.meta.arg ? [...state.audit.entries, ...entries] : entries, hasMore };
      })
      .addCase(logout, () => initialState);
  },
});

export default slice.reducer;
