import appEnv from "appEnv";

const { getAuthData, getLanguage, rootUrl } = appEnv;

function checkStatus(response) {
  console.log("api fetch get response " + response.status);
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else if (response.status === 401 || response.status === 403) {
    return Promise.reject("unauthorized operation");
  } else if (response.status === 500) {
    return Promise.reject("internal server error");
  }
  return Promise.reject("" + response.status);
}

function parseJSON(response) {
  return response.json();
}

export async function httpRequest({ url, method, data, headers }) {
  let httpUrl = rootUrl + url;

  if (!method) {
    method = "GET";
  }
  let option = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": getLanguage(),
      Authorization: getAuthData()?.tokenId,
    },
  };

  if (data) {
    option.body = JSON.stringify(data);
  }

  if (headers) {
    for (let key in headers) {
      if (headers.hasOwnProperty(key)) {
        option.headers[key] = headers[key];
      }
    }
  }

  console.log("calling " + httpUrl);

  return fetch(httpUrl, option)
    .then(checkStatus)
    .then(parseJSON)
    .catch((error) => {
      // normally a network error
      return Promise.reject("network failure");
    });
}

export default httpRequest;
