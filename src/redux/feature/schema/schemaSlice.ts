import {
  CaseReducer,
  PayloadAction,
  createSlice,
  Slice,
} from "@reduxjs/toolkit";
import { RootState } from "../../store";

type SchemaState = {
  schema: string[];
};

const initialState: SchemaState = {
  schema: [],
};

const setSchema: CaseReducer<
  SchemaState,
  PayloadAction<SchemaState["schema"]>
> = (state, { payload }) => {
  state.schema = payload;
};

const schemaSlice: Slice<SchemaState> = createSlice({
  name: "schemaState",
  initialState,
  reducers: {
    setSchema,
  },
});

export const schemaSelector = (state: RootState):SchemaState['schema'] => state.schemaState.schema

export const { setSchema: createSchemaAction } = schemaSlice.actions;
export default schemaSlice.reducer;
export type { SchemaState };
