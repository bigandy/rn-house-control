const houseControlNextUrl = "http://192.168.1.112";

const fetchUrl = (path: string) => `${houseControlNextUrl}/${path}`;

export const sonosApi = (path: string, options?: RequestInit) =>
  fetch(fetchUrl(`api/music/sonos/${path}`), options);

export const bluesoundApi = (path: string, options?: RequestInit) =>
  fetch(fetchUrl(`api/music/bluesound/${path}`), options);

export const sonosPostApi = (path: string, data?: any) =>
  sonosApi(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

export const bluesoundPostApi = (path: string, data?: any) =>
  bluesoundApi(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
