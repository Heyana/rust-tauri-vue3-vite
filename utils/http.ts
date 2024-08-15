import axios from 'axios';
// import { pop, progressLine } from "../Static/Static";
// import { getEnvMode } from "../Const/Const.Editor";
export const netBaseUrl = 'https://api.mtiland.com';

export const getBasePath = (type?: 'project-ip' | 'local-ex') => {
  const str = 'http://localhost:23336';

  console.log(str, 'str');
  return str;
};
const baseUrl = getBasePath();
const http = axios.create();
http.defaults.baseURL = baseUrl;
http.defaults.timeout = 60 * 1000 * 10;
http.interceptors.request.use((config: any) => {
  return config;
});
http.defaults.onDownloadProgress = (progress) => {
  if (!progress.total) return;
  const { total, loaded } = progress;
};
http.defaults.onUploadProgress = (progress) => {
  if (!progress.total) return;
  const { total, loaded } = progress;
};
http.interceptors.response.use((res) => {
  const { data } = res;
  return res;
});
export default http;
