import { useDispatch, useSelector } from "react-redux";
import {
  FileState,
  spreadSheetIdSelector,
  createFileAction,
} from "../redux/feature/file/fileSlice";

export default function useSelectFile() {
  const spreadSheetId = useSelector(spreadSheetIdSelector);

  const dispatch = useDispatch();

  const setSpreadSheetId = (id: string): void => {
    dispatch(createFileAction(id));
  };

  return [spreadSheetId, setSpreadSheetId] as const
}
