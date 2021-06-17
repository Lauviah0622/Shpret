import {
  CaseReducer,
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "../../store";
import { getSpreadSheet } from "../../../gpai/spreadSheet";

type Sheet = {
  sheetId: number;
  title: string;
  index: number;
  headerRange: string | null;
  headerFields: string[];
};

interface SpreadSheetState {
  id: string | null;
  current: {
    sheetIndex: string | null;
  };
  sheets: Sheet[];
  title: string | null;
}

const initialState: SpreadSheetState = {
  id: null,
  current: {
    sheetIndex: null,
  },
  sheets: [],
  title: null,
};

type SpreadSheetReducer<P> = CaseReducer<SpreadSheetState, PayloadAction<P>>;

interface Reducers extends SliceCaseReducers<SpreadSheetState> {
  setId: SpreadSheetReducer<string>;
  setSheets: SpreadSheetReducer<Sheet[]>;
}

const reducers: Reducers = {
  setId: (state, { payload }) => {
    state.id = payload;
  },
  setSheets: (state, { payload }) => {
    state.sheets = payload;
  },
  setTitle: (state, { payload }) => {
    state.title = payload;
  },
};

const fileSlice = createSlice({
  name: "spreadSheetState",
  initialState,
  reducers,
});

const { setId, setTitle, setSheets } = fileSlice.actions;

type GoogleSheetType = {
  properties: {
    sheetId: number;
    title: string;
    index: number;
    [propName: string]: any;
  };
  [propName: string]: any;
};

const transFetchSheet = ({ properties }: GoogleSheetType): Sheet => {
  const { sheetId, index, title } = properties;
  return {
    sheetId,
    title,
    index,
    headerRange: null,
    headerFields: [],
  };
};

export const fetchSpreadSheet =
  (spreadSheetId: string) =>
  async (dispatch: AppDispatch, getState: () => SpreadSheetState) => {
    try {
      const { result } = await getSpreadSheet(spreadSheetId);
      console.log(result);
      dispatch(setId(spreadSheetId));
      dispatch(setTitle(result.properties.title));
      const sheets: Sheet[] = result.sheets.map(transFetchSheet);
      dispatch(setSheets(sheets));
      return true;
    } catch (err) {
      return false
    }
  };

export default fileSlice.reducer;

export type { SpreadSheetState };
export const spreadSheetStateSelector: (state: RootState) => SpreadSheetState =
  (state) => state.spreadSheetState;
