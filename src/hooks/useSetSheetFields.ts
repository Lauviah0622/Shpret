import { Dispatch, useEffect } from "react";

import useSign from "./useSign";

import { useDispatch, useSelector } from "react-redux";
import { spreadSheetStateSelector, createSetFieldsAction } from '../redux/feature/spreadSheet/spreadSheetSlice';
import { getFields } from "../gpai/spreadSheet";

async function getSheetFields(spreadSheetId: string) {
  try {
    const sheetFields = await getFields(spreadSheetId, "1:1");
    return sheetFields.result
  } catch (err) {
    return err
  }
}

function updateFields(
  // TODO 這個 dispatch 也要補 Type
  dispatcher: Dispatch<any>,
  fieldFromSheet: string[]
) {
  dispatcher(createSetFieldsAction(fieldFromSheet));
}

export default async function useSetSheetFields() {
  const { id: spreadSheetId } = useSelector(spreadSheetStateSelector);

  const [signState] = useSign();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchField = async () => {
      console.log('fetach!!');
      try {
        if (!signState) throw Error('no login')
        const fields = await getSheetFields(spreadSheetId);
        updateFields(dispatch, fields.values[0]);
      } catch (err) {
        console.log(err);
        // TODO fetch error UI
      }
    };

    fetchField()
  }, [signState, spreadSheetId]);
}
