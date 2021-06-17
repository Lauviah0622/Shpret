import { useReducer, useMemo } from "react";

const TYPE = {
  updateSpreadSheelUrl: "spreadSheetUrl.update",
  updateVarifiedSpreadSheetId: "varificatedSpreadSheetId.update"
} as const;

type SpreadSheetUrlInputState = {
  isDirty: boolean;
  spreadSheetUrl: string;
};

type ActionType = { type: typeof TYPE.updateSpreadSheelUrl; payload: string }



function UrlInputReducer(
  state: SpreadSheetUrlInputState,
  { type, payload }: ActionType
): SpreadSheetUrlInputState {
  switch (type) {
    case TYPE.updateSpreadSheelUrl:
      {

        return {
          ...state,
          spreadSheetUrl: payload,
          isDirty: true,
        };

      }

    default:
      throw new Error();
  }
}

const URL_MATCH_REGEX = /docs\.google\.com\/spreadsheets\/d\/([\w\-]{40,})\//;
const extractSpreadIdFrom = (str: string): string | null => {
  const urlMatchIdResult = str.match(URL_MATCH_REGEX);
  return urlMatchIdResult ? urlMatchIdResult[1] : null;
};

function asnycVerified(spreadSheetUrl:string):Promise<boolean> {
  const res = new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  }) as Promise<true> //? 這裡怎麼辦？
  return res
}

export default function useUrlInputState() {
  const [state, dispatch] = useReducer<typeof UrlInputReducer>(UrlInputReducer, {
    isDirty: false,
    spreadSheetUrl: ''
  })

  const idExtractFromUrl = useMemo(
    () => extractSpreadIdFrom(state.spreadSheetUrl),
    [state.spreadSheetUrl]
  );

  const setSpreadSheetUrl = (SpreadSheelUrl: string) => {
    dispatch({
      type: TYPE.updateSpreadSheelUrl,
      payload: SpreadSheelUrl
    })
  }


  return {
    idExtractFromUrl,
    spreadSheetUrl: state.spreadSheetUrl,
    isDirty: state.isDirty,
    setSpreadSheetUrl
  }

}
