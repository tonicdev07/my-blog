import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_APP_SERVER_URL,
  withCredentials: true,
});

export async function makeRequest(url: string, options?: any) {
  return await api(url, options)
    .then((res) => res.data)
    .catch((e) => Promise.reject(e?.respone?.message ?? "Error "));
}
