export async function getFields(spreadsheetId: string, range: string) {
  const fields = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `!${range}`,
  });
  return fields;
}

export async function appendItemByField<TypeOfField extends Array<string>>(
  spreadsheetId:string,
  appendItem: Array<string>  // FixedLengthArray<string, TypeOfField["length"]>
): Promise<any> {
  return await gapi.client.sheets.spreadsheets.values.append(
    {
      spreadsheetId,
      valueInputOption: "RAW",
      range: `1:1`,
    },
    {
      majorDimension: 'COLUMNS',
      values: appendItem.map((field) => [field]),
    }
  );
}

export async function getSpreadSheet(spreadsheetId: string) {
  try {
    const spreadSheetData = await gapi.client.sheets.spreadsheets.get({
      spreadsheetId,
      includeGridData: false,
    });
    return spreadSheetData
  } catch (err) {
    console.log('getSrpeadSheet');
    console.log(err);
    return Promise.reject(err)
  }
  
}
