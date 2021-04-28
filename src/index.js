import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import App from "./app";
import appEnv from "appEnv";
import { getProfile as getProfileRemote } from "@/api";
import ProfileContext from "./profile";
import FullDiv from "@/components/full-div";

// authorized, 0 means authorizing, -1 means fail, 1 means success
const AUTHORIZE_STATES = {
  AUTHORIZING: 0,
  FAIL: -1,
  SUCCESS: 1,
};

const initProfile = {
  authorized: AUTHORIZE_STATES.AUTHORIZING,
  data: null,
};

function redirectToAuthPage() {
  console.log("will redirect to auth page");
  let param = {
    source: encodeURIComponent(window.location.origin),
    productLine: encodeURIComponent("BOSS"),
    skipCorpSelect: encodeURIComponent("true"),
  };

  let str = btoa(unescape(encodeURIComponent(JSON.stringify(param))));

  setTimeout(() => {
    window.location = appEnv.authUrl + "?p=" + str;
  }, 2000);
}

function failAuthorize(profile) {
  console.log(`authorize fail with ${JSON.stringify(profile)}`);
  let newProfile = Object.assign({}, profile, {
    authorized: AUTHORIZE_STATES.FAIL,
  });
  console.log(`fail profile ${JSON.stringify(newProfile)}`);
  return newProfile;
}

const processSearchParams = () => {
  let searchParams = new URL(window.location).searchParams;
  let p = searchParams.get("p");
  // debugger
  if (!p || p === "undefined") {
    console.log("no parameter p provided");
    return;
  }
  try {
    p = atob(p);
    p = escape(p);
    let str = decodeURIComponent(p);
    let json = JSON.parse(str);
    let accessToken = json["accessToken"];
    json.tokenId = decodeURIComponent(accessToken);
    json.lang =
      (json.lang && decodeURIComponent(json.lang)) ||
      searchParams.get("lang") ||
      "zh";
    appEnv.saveAuthData(json);
    console.log("local storage saved");
  } catch (error) {
    console.log("failed to parse parameter p");
    console.error(error);
  }
};

async function getProfile(setProfile) {
  processSearchParams();

  let authData = appEnv.getAuthData();
  if (!authData) {
    console.log("no auth data got");
    setProfile(failAuthorize);
    return;
  }

  console.log("auth data got, will fetch remote");

  try {
    let res = await getProfileRemote(authData.token);

    if (!res.success) {
      setProfile(failAuthorize);
      return;
    }

    setProfile((profile) => {
      return Object.assign({}, profile, {
        authorized: AUTHORIZE_STATES.SUCCESS,
        data: res.data,
      });
    });
  } catch (error) {
    console.error("failed to get profile");
    console.error(error);
    setProfile(failAuthorize);
  }
}

function HomePage() {
  const [profile, setProfile] = useState(initProfile);

  useEffect(() => {
    getProfile(setProfile);
  }, [setProfile]);

  useEffect(() => {
    console.log(`profile is ${JSON.stringify(profile)}`);
    if (profile.authorized === AUTHORIZE_STATES.FAIL) {
      // redirectToAuthPage();
    }
  }, [profile.authorized]);

  if (profile.authorized !== AUTHORIZE_STATES.SUCCESS) {
    return <FullDiv>loading</FullDiv>;
  }

  return (
    <ProfileContext.Provider value={profile.data}>
      <FullDiv>
        <App />
      </FullDiv>
    </ProfileContext.Provider>
  );
}

ReactDOM.render(<HomePage />, document.getElementById("root"));
