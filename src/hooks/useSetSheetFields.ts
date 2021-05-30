import { Dispatch, useEffect } from "react";

import useSign from "./useSign";
import useSelectFile from "./useSelectFile";

import {
  createSchemaAction,
  SchemaState,
} from "../redux/feature/schema/schemaSlice";
import { useDispatch } from "react-redux";
import { getFields } from "../gpai/spreadSheet";
import { Action } from "redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

async function getSheetFields(spreadSheetId: string, sheetName: string) {
  try {
    const sheetFields = await getFields(spreadSheetId, "1:1");
    return sheetFields.result


  } catch (err) {

  }
}

function updateFields(
  // TODO 這個 dispatch 也要補 Type
  dispatcher: Dispatch<any>,
  fieldFromSheet: string[]
) {
  dispatcher(createSchemaAction(fieldFromSheet));
}

export default async function useSetSheetFields() {


  const [signState] = useSign();
  const [file] = useSelectFile();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchField = async () => {
      console.log('fetach!!');
      try {
        if (!signState) throw Error('no login')
        const fields = await getSheetFields(file.spreadSheetId, file.sheetName);
        updateFields(dispatch, fields.values[0]);
      } catch (err) {
        console.log(err);
        // TODO fetch error UI
      }
    };

    fetchField()
  }, [signState, file, dispatch, ]);

  return [] as const;
}
