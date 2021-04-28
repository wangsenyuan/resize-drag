import React, { useContext } from "react";

export const ProfileContext = React.createContext({});

export function useProfile() {
  return useContext(ProfileContext);
}

export default ProfileContext;
