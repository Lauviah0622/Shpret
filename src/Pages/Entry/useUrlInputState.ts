import { useReducer, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";

import { RootState } from "../../redux/store";
import useSignHook from "../../hooks/useSignState";
import { fetchSpreadSheet } from "../../redux/feature/spreadSheet/spreadSheetSlice";

const TYPE = {
  updateState: "spreadSheetUrl.update",
} as const;

export type SpreadSheetUrlInputState = {
  isDirty: boolean;
  url: string;
  urlState: "noId" | "validId" | "invalidId" | "unverifiedId";
};

type ActionType = {
  type: typeof TYPE.updateState;
  payload: Partial<SpreadSheetUrlInputState>;
};

const URL_MATCH_REGEX = /docs\.google\.com\/spreadsheets\/d\/([\w\-]{40,})\//;
const extractIdFromUrl = (url: string): string | null => {
  const urlMatchIdResult = url.match(URL_MATCH_REGEX);
  return urlMatchIdResult ? urlMatchIdResult[1] : null;
};

function UrlInputReducer(
  state: SpreadSheetUrlInputState,
  { type, payload }: ActionType
): SpreadSheetUrlInputState {
  switch (type) {
    case TYPE.updateState: {
      return {
        ...state,
        ...payload,
      };
    }
    default:
      throw new Error();
  }
}

type CacheType = {
  [url: string]: 1 | 0;
};
function useUrlValidationCache() {
  const cacheRef = useRef<CacheType>({});
  const set = (id: string, isIdValid: boolean) => {
    cacheRef.current[id] = +isIdValid as 1 | 0;
  };

  const get = (id: string) => {
    const idState = cacheRef.current[id];
    return idState === undefined ? -1 : idState;
    // -1 means no prop
  };
  return [get, set] as const;
}

export default function useUrlInputState() {
  const reduxDispatch = useDispatch()
  const [state, dispatch] = useReducer<typeof UrlInputReducer>(
    UrlInputReducer,
    {
      isDirty: false,
      url: "",
      urlState: "noId",
    }
  );
  const [isSignIn] = useSignHook();
  const [getIdCache, setIdCache] = useUrlValidationCache();

  const setUrl = (url: string) => {
    let urlState: SpreadSheetUrlInputState["urlState"];
    const id = extractIdFromUrl(url);
    if (!id) {
      urlState = "noId";
    } else {
      const idCacheState = getIdCache(id);
      urlState =
        idCacheState === 1
          ? "validId"
          : idCacheState === 0
          ? "invalidId"
          : "unverifiedId";
    }

    dispatch({
      type: TYPE.updateState,
      payload: {
        url,
        urlState,
        isDirty: true
      },
    });
  };

  const verifyUrl = async () => {
    if (!isSignIn) return ;
    if (state.urlState !== "unverifiedId") return;
    const id = extractIdFromUrl(state.url) as string
    try {
      await reduxDispatch(fetchSpreadSheet(id));
      setIdCache(id, true);
      dispatch({
        type: TYPE.updateState,
        payload: {
          urlState: 'validId',
        },
      });
      
    } catch (err) {
      console.log('verify', err);
      setIdCache(id, false);
      dispatch({
        type: TYPE.updateState,
        payload: {
          urlState: 'invalidId',
          isDirty: false
        },
      });
      return err
    }
  };

  return {
    isDirty: state.isDirty,
    url: state.url,
    urlState: state.urlState,
    setUrl,
    verifyUrl,
  };
}
