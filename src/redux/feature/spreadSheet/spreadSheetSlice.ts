import {
  CaseReducer,
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import type { RootState } from "../../store";

type SpreadSheetState = {
  id: string;
  fields: string[];
  headerRange: string;
  sheetId: string;
};

const initialState: SpreadSheetState = {
  id: "",
  fields: [],
  headerRange: "",
  sheetId: "",
};

type SpreadSheetReducer<P> = CaseReducer<SpreadSheetState, PayloadAction<P>>;

interface Reducers extends SliceCaseReducers<SpreadSheetState> {
  setId: SpreadSheetReducer<string>;
  setHeaderRange: SpreadSheetReducer<string>;
  setFields: SpreadSheetReducer<string[]>;
  setSheetId: SpreadSheetReducer<string>;
}

const reducers: Reducers = {
  setId: (state, { payload }) => {
    state.id = payload;
  },
  setHeaderRange: (state, { payload }) => {
    state.headerRange = payload;
  },
  setFields: (state, { payload }) => {
    state.fields = payload;
  },
  setSheetId: (state, { payload }) => {
    state.sheetId = payload;
  }
};

const fileSlice = createSlice({
  name: "spreadSheetState",
  initialState,
  reducers,
});

export default fileSlice.reducer;
export const {
  setId: createSetIdAction,
  setFields: createSetFieldsAction,
  setHeaderRange: createSetRangeAction,
  setSheetId: createsetSheetIdAction,
} = fileSlice.actions;

export type { SpreadSheetState };
export const spreadSheetStateSelector: (state: RootState) => SpreadSheetState =
  (state) => state.spreadSheetState;
