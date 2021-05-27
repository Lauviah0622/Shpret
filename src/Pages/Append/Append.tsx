import React from "react";
import { Button } from "antd";

import useSchema from "../../hooks/useSchema";

/* 
  1. get schema 
  2. list schema
  3. append rows by schema
*/

export default function Append() {
  const [schema, setSchema] = useSchema();


  const btnClickHdlr = () => { setSchema(['1', '2', '3']) };
  return (
    <div>
      <Button onClick={btnClickHdlr}>Click test</Button>
      {JSON.stringify(schema)}
    </div>
  );
}
