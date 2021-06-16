import {
  CaseReducer,
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import type { RootState } from "../../store";

interface SpreadSheetState {
  id: string;
  fields: string[];
  headerRange: string;
  sheetId: string;
  [key: string]: any
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
  setSpreadSheetState: SpreadSheetReducer<Partial<SpreadSheetState>>;
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
  },
  setSpreadSheetState: (state, { payload }) => {
    for (let prop in payload) {
      state[prop] = payload[prop];
    }
  },
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
  setSheetId: createSetSheetIdAction,
  setSpreadSheetState: createSetSpreadSheetState
} = fileSlice.actions;

export type { SpreadSheetState };
export const spreadSheetStateSelector: (state: RootState) => SpreadSheetState =
  (state) => state.spreadSheetState;
