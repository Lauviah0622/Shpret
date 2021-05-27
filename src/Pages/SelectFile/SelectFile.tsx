import React, {ChangeEventHandler, MouseEventHandler, useState} from "react";
import { Input, Button, Typography, } from "antd";

const { Text } = Typography;

import useSelectFile from "../../hooks/useSelectFile";

export default function SelectFile() {
  const [spreadSheetUrl, setSpreadSheetUrl] = useState<string>('');
  const [spreadSheetId, setSpreadSheetId] = useSelectFile();

  const inputChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSpreadSheetUrl(e.target.value)
  }
  const submitButtonHandler: MouseEventHandler = () => {
    const match = spreadSheetUrl.match(/docs\.google\.com\/spreadsheets\/d\/([\w\-]{40,})\//);
    console.log(match);
    if (match) {
      const extractID = match[1];
      setSpreadSheetId(extractID);
    }
  }

  return (
    <div>
      <Input placeholder="Basic usage" onChange={inputChangeHandler}/>
      <Button onClick={submitButtonHandler}>Submit</Button>
      <Text mark>{spreadSheetId || 'null'}</Text>
    </div>
  );
}

// TODO 記得要做 error 的 UI 處理