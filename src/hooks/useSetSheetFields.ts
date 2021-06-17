import { Dispatch, useEffect } from "react";

import useSign from "./useSignState";

import { useDispatch, useSelector } from "react-redux";
import { spreadSheetStateSelector } from '../redux/feature/spreadSheet/spreadSheetSlice';
import { getFields } from "../gpai/spreadSheet";
import {AppDispatch} from '../redux/store';

async function getSheetFields(spreadSheetId: string) {
  try {
    const sheetFields = await getFields(spreadSheetId, "1:1");
    return sheetFields.result
  } catch (err) {
    return err
  }
}




// !TODO 這裡的 fetch 要抓到 Redux 裡面，hooks 只留下 pure state 的操作
export default async function useSetSheetFields() {
  const { id: spreadSheetId } = useSelector(spreadSheetStateSelector);

  const [signState] = useSign();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchField = async () => {
      console.log('fetach!!');
      try {
        if (!signState) throw Error('no login')
        const fields = await getSheetFields(spreadSheetId as string);
        //TODO updateFields 之後換新的上去
        // updateFields(dispatch, fields.values[0]);
      } catch (err) {
        console.log(err);
        // TODO fetch error UI
      }
    };

    fetchField()
  }, [signState, spreadSheetId]);
}
