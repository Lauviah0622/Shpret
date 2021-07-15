import { Dispatch, useEffect } from "react";

import useSign from "./useSignState";

import { useDispatch, useSelector } from "react-redux";
import { spreadSheetStateSelector } from "../redux/feature/spreadSheet/spreadSheetSlice";
import { getFields } from "../gpai/spreadSheet";

async function getSheetFields(spreadSheetId: string) {
  try {
    const sheetFields = await getFields(spreadSheetId, "1:1");
    return sheetFields.result;
  } catch (err) {
    return err;
  }
}

export default async function useSetSheetFields() {
  const { id: spreadSheetId } = useSelector(spreadSheetStateSelector);

  const [signState] = useSign();

  useEffect(() => {
    const fetchField = async () => {
      console.log("fetach!!");
      try {
        if (!signState) throw Error("no login");
        const fields = await getSheetFields(spreadSheetId as string);

        // updateFields(dispatch, fields.values[0]);
      } catch (err) {
        console.log(err);
        /**
         * TODO fetch error UI
         * 還沒做錯誤處理，之後必須做
         */
      }
    };

    fetchField();
  }, [signState, spreadSheetId]);
}
