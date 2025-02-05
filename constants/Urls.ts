const houseControlNextUrl = "http://192.168.1.112";

const fetchUrl = (path: string) => `${houseControlNextUrl}/${path}`;

export const sonosApi = (path: string, options?: RequestInit) =>
  fetch(fetchUrl(`api/music/sonos/${path}`), options);

export const bluesoundApi = (path: string, options?: RequestInit) =>
  fetch(fetchUrl(`api/music/bluesound/${path}`), options);
