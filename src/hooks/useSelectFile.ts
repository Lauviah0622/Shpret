import { useDispatch, useSelector } from "react-redux";
import {
  FileState,
  fileStateSelector,
  createSetFileAction,
  createSetSheetAction
} from "../redux/feature/file/fileSlice";

export default function useSelectFile() {
  const file = useSelector(fileStateSelector);

  const dispatch = useDispatch();

  const setSpreadSheetId = (id: string): void => {
    dispatch(createSetFileAction(id));
  };

  const setSheetName = (name: string):void => {
    dispatch(createSetSheetAction(name))
  }

  return [file, setSpreadSheetId, setSheetName] as const
}
