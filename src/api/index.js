import { httpRequest } from "./request";

export async function getProfile() {
  return httpRequest({
    url: "/profile",
  });
}
