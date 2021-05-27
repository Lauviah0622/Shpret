import { useEffect, useState } from "react";


const ENV = {
  API_KEY: import.meta.env.VITE_API_KEY,
  CLIENT_ID: import.meta.env.VITE_CLIENT_ID,
  SCOPE: import.meta.env.VITE_SCOPE,
  DISCOVERY_DOCS_ARRAY: import.meta.env.VITE_DISCOVERY_DOCS_STRING.split(" "),
  GAPI_SRC: import.meta.env.VITE_GAPI_SRC,
};

function importGapiScript() {
  const existingScript = document.getElementById("gapi") as HTMLScriptElement;
  if (existingScript) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = ENV.GAPI_SRC;
    script.id = "gapi";
    script.async = true;
    script.onload = () => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    };
    script.onerror = () => {
      reject(false);
    };
    document.body.appendChild(script);
  });
}

function loadGapi() {
  return new Promise((res, rej) => {
    gapi.load("client:auth2", () => {
      res(true);
    });
  });
}

function initGpiClient() {
  return gapi.client.init({
    apiKey: ENV.API_KEY,
    clientId: ENV.CLIENT_ID,
    discoveryDocs: ENV.DISCOVERY_DOCS_ARRAY,
    scope: ENV.SCOPE,
  });
}


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


export default function usePrepareGapiHook() {
  const [gapiPrepareComplete, setGapiPrepareComplete] = useState<boolean>(false);

  useEffect(() => {
    prepareGapi((authInstance) => {
      setGapiPrepareComplete(true);
      console.log('auth!!!', authInstance.isSignedIn.get());
    });
  }, []);

  console.log(gapiPrepareComplete
    ? "gapi: prepare complete"
    : "gapi: not prepare");
  
  return gapiPrepareComplete;
}
