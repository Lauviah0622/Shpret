import { useHistory } from "react-router-dom";

export default function useRedirect() {
  const history = useHistory();

  const redirectTo = (path:string) => {
    history.push(path)
  }
  return redirectTo
};
