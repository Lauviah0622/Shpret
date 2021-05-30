import React, { ChangeEventHandler, MouseEventHandler, useState } from "react";
import { Input, Button, Typography } from "antd";

const { Text } = Typography;

import useSelectFile from "../../hooks/useSetSpreadSheetId";

export default function SelectFile() {
  // ! 記得刪掉
  const [spreadSheetUrl, setSpreadSheetUrl] = useState<string>("https://docs.google.com/spreadsheets/d/1MxRChTFrqYtIae9Sj68C1cbkI0o0wvFIlAbP3W9AnK4/edit#gid=1499052641");
  const [spreadSheetId, setSpreadSheetId, setSheetName] = useSelectFile();

  const ssUrlChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSpreadSheetUrl(e.target.value);
  };

  const submitButtonHandler: MouseEventHandler = () => {
    const match = spreadSheetUrl.match(
      /docs\.google\.com\/spreadsheets\/d\/([\w\-]{40,})\//
    );
    console.log(match);
    if (match) {
      const extractID = match[1];
      setSpreadSheetId(extractID);
    }
  };

  return (
    <div>
      spreadSheet ID
      <Input
        placeholder="Basic usage"
        onChange={ssUrlChangeHandler}
        value={spreadSheetUrl}
      />
      sheetName
      <Button onClick={submitButtonHandler}>Submit</Button>
      <Text mark>{JSON.stringify(spreadSheetId) || "null"}</Text>
    </div>
  );
}

// TODO 記得要做 error 的 UI 處理
