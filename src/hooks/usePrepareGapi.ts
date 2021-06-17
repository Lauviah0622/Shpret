import { useEffect, useState } from "react";
import { importGapiScript, loadGapi, initGpiClient } from '../gpai/client';

async function prepareGapi(cb: (authInstance: any) => void) {
  try {
    console.log("======== Gapi prepare start ========");
    await importGapiScript();
    console.log("import Gapi success");
    await loadGapi();
    console.log("load Gapi sucess");
    await initGpiClient();
    console.log("init Gapi success");
    console.log("======== Gapi prepare end ========");
    const authInstance = await gapi.auth2.getAuthInstance()
    cb(authInstance)
    
  } catch (err) {
    console.log(err);
    console.log("======== Gapi prepare fail ========");

  }
  
}

export default function usePrepareGapiHook(gapiCompleteCallback: (isSignIn:boolean, authInstance:any) => void) {
  const [gapiPrepareComplete, setGapiPrepareComplete] = useState<boolean>(false);

  useEffect(() => {
    prepareGapi((authInstance) => {
      setGapiPrepareComplete(true);
      gapiCompleteCallback(authInstance.isSignedIn.get(), authInstance)
      console.log('auth!!!', authInstance.isSignedIn.get());
    });
  }, []);

  console.log(gapiPrepareComplete
    ? "gapi: prepare complete"
    : "gapi: not prepare");
  
  return gapiPrepareComplete;
}
