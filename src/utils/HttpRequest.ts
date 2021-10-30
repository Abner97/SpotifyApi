import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const spotifyApi = axios.create({
  baseURL: "https://accounts.spotify.com/api",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export async function httpRequest<T>(config: AxiosRequestConfig): Promise<T> {
  return await spotifyApi(config)
    .then((res: AxiosResponse<T>) => {
      return res.data;
    })
    .catch((error: any) => {
      console.log(error);
      return error;
    });
}
