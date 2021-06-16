const ENV = {
  API_KEY: import.meta.env.VITE_API_KEY,
  CLIENT_ID: import.meta.env.VITE_CLIENT_ID,
  SCOPE: import.meta.env.VITE_SCOPE,
  DISCOVERY_DOCS_ARRAY: import.meta.env.VITE_DISCOVERY_DOCS_STRING.split(" "),
  GAPI_SRC: import.meta.env.VITE_GAPI_SRC,
};

export function importGapiScript():Promise<boolean> {
  const existingScript = document.getElementById("gapi") as HTMLScriptElement;
  if (existingScript) {
    return Promise.resolve(true);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = ENV.GAPI_SRC;
    script.id = "gapi";
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      reject(false);
    };
    document.body.appendChild(script);
  });
}

export function loadGapi() {
  return new Promise((res, rej) => {
    gapi.load("client:auth2", () => {
      res(true);
    });
  });
}

export async function initGpiClient() {
  try {
    const res = await gapi.client.init({
      apiKey: ENV.API_KEY,
      clientId: ENV.CLIENT_ID,
      discoveryDocs: ENV.DISCOVERY_DOCS_ARRAY,
      scope: ENV.SCOPE,
    });

    console.log(res);
  } catch(err) {
    throw err
  }
}



