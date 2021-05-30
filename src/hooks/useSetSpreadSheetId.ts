import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  spreadSheetStateSelector,
  createSetIdAction,
} from "../redux/feature/spreadSheet/spreadSheetSlice";

export default function useSpreadSheetId(url: string): void {
  
  const dispatch = useDispatch();

  const match = url.match(
    /docs\.google\.com\/spreadsheets\/d\/([\w\-]{40,})\//
  );
  
  useEffect(() => {
    if (match) {
      dispatch(createSetIdAction(url))
    }
  }, [url])
}
