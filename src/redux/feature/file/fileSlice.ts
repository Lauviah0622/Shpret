import {
  CaseReducer,
  createSlice,
  PayloadAction,
  PayloadActionCreator,
} from "@reduxjs/toolkit";
import type { RootState } from "../../store";

type FileState = {
  spreadSheetId: string;
};

const initialState: FileState = {
  spreadSheetId: "",
};

const setFile: CaseReducer<FileState, PayloadAction<string>> = (
  state,
  { payload }
) => {
  state.spreadSheetId = payload;
};

const fileSlice = createSlice({
  name: "fileState",
  initialState,
  reducers: {
    setFile,
  },
});

export default fileSlice.reducer;
export const { setFile: createFileAction } = fileSlice.actions;

export type { FileState };
export const spreadSheetIdSelector: (state: RootState) => FileState["spreadSheetId"] = (state) => state.fileState.spreadSheetId;
