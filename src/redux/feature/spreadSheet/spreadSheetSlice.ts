import {
  CaseReducer,
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "../../store";
import { getFields, getSpreadSheet } from "../../../gpai/spreadSheet";

export type Sheet = {
  sheetId: number;
  title: string;
  index: number;
  headerRange: string | null;
  headerFields: string[];
  values: (string | null)[][];
};

/**
 * TODO: 改成用 initSpreadSheetState | spreadSheetState
 * 就可以分開使用
 */

interface SpreadSheetState {
  id: string | null;
  current: {
    sheetIndex: number | null;
  };
  sheets: {
    [index: number]: Sheet;
  };
  title: string | null;
}

const initialState: SpreadSheetState = {
  id: null,
  current: {
    sheetIndex: null,
  },
  sheets: {},
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
    for (const sheet of payload) {
      state.sheets[sheet.index] = sheet;
    }
  },
  setTitle: (state, { payload }) => {
    state.title = payload;
  },
  setCurrentIndex: (state, { payload }) => {
    state.current.sheetIndex = payload;
  },
  setSheetData: (state, { payload }: { payload: Sheet }) => {
    state.sheets[payload.index] = {
      ...state.sheets[payload.index],
      ...payload,
    };
  },
};

const fileSlice = createSlice({
  name: "spreadSheetState",
  initialState,
  reducers,
});

const { setId, setTitle, setSheets, setCurrentIndex, setSheetData } =
  fileSlice.actions;
export { setCurrentIndex, setSheetData };

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
    values: [[]],
  };
};

export const fetchSpreadSheet =
  (spreadSheetId: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const spreadSheetResponse = await getSpreadSheet(spreadSheetId);
      console.log("fetchSpreadSheet");
      console.log(spreadSheetResponse);
      const { result } = spreadSheetResponse;
      dispatch(setId(spreadSheetId));
      dispatch(setTitle(result.properties.title));
      const sheets: Sheet[] = result.sheets.map(transFetchSheet);
      dispatch(setSheets(sheets));
      return true;
    } catch (err) {
      console.log("fetchSpreadSheet:error", err);
      return Promise.reject(err);
    }
  };

export const fetchSheetValues =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { spreadSheetState } = getState();
      const currentSheet =
        spreadSheetState.sheets[spreadSheetState.current.sheetIndex as number];
      const { result: sheetResponse } = await getFields(
        spreadSheetState.id as string,
        "A:Z",
        currentSheet.title
      );
      dispatch(
        setSheetData({
          index: currentSheet.index,
          values: sheetResponse.values,
        })
      );
    } catch (err) {}
  };

// export const setSheet

export default fileSlice.reducer;

export type { SpreadSheetState };
export const spreadSheetStateSelector: (state: RootState) => SpreadSheetState =
  (state) => state.spreadSheetState;

export const currentSheetStateSelector = ({
  spreadSheetState,
}: RootState): Sheet | null => {
  const currentId: number = spreadSheetState.current.sheetIndex as number;
  console.log('currentId', currentId);
  if (typeof currentId !== 'number') return null;
  return spreadSheetState.sheets[currentId];
};
