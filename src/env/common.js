import { reactLocalStorage } from "reactjs-localstorage";

function getFromCache(key) {
  let profile = reactLocalStorage.getObject("profile");
  return profile?.[key];
}

function saveAuthData(data) {
  reactLocalStorage.setObject("AUTH_DATA", data);
}

function getAuthData() {
  return reactLocalStorage.getObject("AUTH_DATA");
}

function getLanguage() {
  let authData = getAuthData();
  return authData?.lang ?? "zh";
}

export default {
  getFromCache,
  saveAuthData,
  getAuthData,
  getLanguage,
};
