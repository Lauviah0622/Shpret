export async function getFields(spreadsheetId: string, range: string, sheetName: string = '') {
  const fields = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!${range}`,
  });
  return fields;
}

type appendLocation = {
  spreadsheetId: string,
  range: string,
  sheetId: string

}

export async function appendItemByField<TypeOfField extends Array<string>>(
  { spreadsheetId,
    range,
    sheetId
  }: appendLocation,
  appendItem: Array<string>,
): Promise<any> {
  return await gapi.client.sheets.spreadsheets.values.append(
    {
      spreadsheetId,
      valueInputOption: "USER_ENTERED",
      range: `${sheetId}!${range}`,
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
