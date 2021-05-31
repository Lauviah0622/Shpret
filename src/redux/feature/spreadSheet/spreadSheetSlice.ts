import {
  CaseReducer,
  createSlice,
  PayloadAction,
  PayloadActionCreator,
} from "@reduxjs/toolkit";
import type { RootState } from "../../store";

type SpreadSheetState = {
  id: string;
  fields: string[];
};

const initialState: SpreadSheetState = {
  id: "",
  fields: []
};

const setId: CaseReducer<SpreadSheetState, PayloadAction<string>> = (
  state,
  { payload }
) => {
  state.id = payload;
};

const setFields: CaseReducer<SpreadSheetState, PayloadAction<string[]>> = (
  state,
  { payload }
) => {
  state.fields = payload;
};

const fileSlice = createSlice({
  name: "spreadSheetState",
  initialState,
  reducers: {
    setId,
    setFields
  },
});

export default fileSlice.reducer;
export const { setId: createSetIdAction, setFields: createSetFieldsAction } = fileSlice.actions;

export type { SpreadSheetState };
export const spreadSheetStateSelector: (state: RootState) => SpreadSheetState =
  (state) => state.spreadSheetState;