import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSheetValues,
  spreadSheetStateSelector,
} from "../../redux/feature/spreadSheet/spreadSheetSlice";
import useSign from "../../hooks/useSignState";

export default function useFetchSheetData() {
  const dispatch = useDispatch();
  const spreadSheetState = useSelector(spreadSheetStateSelector);
  const [signState] = useSign();

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!signState) throw Error("no login");
        await dispatch(fetchSheetValues());
      } catch (err) {}
    };

    fetch();
  }, [spreadSheetState.current.sheetIndex, signState]);
}
