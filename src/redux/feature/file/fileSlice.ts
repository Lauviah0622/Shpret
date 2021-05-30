import {
  CaseReducer,
  createSlice,
  PayloadAction,
  PayloadActionCreator,
} from "@reduxjs/toolkit";
import type { RootState } from "../../store";

type FileState = {
  spreadSheetId: string;
  sheetName: string;
};

const initialState: FileState = {
  spreadSheetId: "",
  sheetName: "",
};

const setFile: CaseReducer<FileState, PayloadAction<string>> = (
  state,
  { payload }
) => {
  state.spreadSheetId = payload;
};

const setSheet: CaseReducer<FileState, PayloadAction<string>> = (
  state,
  { payload }
) => {
  state.sheetName = payload;
};

const fileSlice = createSlice({
  name: "fileState",
  initialState,
  reducers: {
    setFile,
    setSheet
  },
});

export default fileSlice.reducer;
export const { setFile: createSetFileAction, setSheet: createSetSheetAction } = fileSlice.actions;

export type { FileState };
export const fileStateSelector: (
  state: RootState
) => FileState = (state) => state.fileState;
