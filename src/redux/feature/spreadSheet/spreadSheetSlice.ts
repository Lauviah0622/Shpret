import {
  CaseReducer,
  createSlice,
  PayloadAction,
  PayloadActionCreator,
} from "@reduxjs/toolkit";
import type { RootState } from "../../store";

type SpreadSheetState = {
  id: string;
};

const initialState: SpreadSheetState = {
  id: "",
};

const setId: CaseReducer<SpreadSheetState, PayloadAction<string>> = (
  state,
  { payload }
) => {
  state.id = payload;
};

const fileSlice = createSlice({
  name: "spreadSheetState",
  initialState,
  reducers: {
    setId
  },
});

export default fileSlice.reducer;
export const { setId: createSetIdAction } = fileSlice.actions;

export type { SpreadSheetState };
export const spreadSheetStateSelector: (
  state: RootState
) => SpreadSheetState = (state) => state.spreadSheetState;
