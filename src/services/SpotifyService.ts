import { SpotifyTokenResponse } from "../models/SpotifyTokenResponse";
import { AxiosRequestConfig } from "axios";
import { httpRequest } from "../utils/HttpRequest";

export default class SpotifyService {
  CLIENT_ID = process.env.CLIENT_ID;
  private CLIENT_SECRET = process.env.CLIENT_SECRET;
  REDIRECT_URI = process.env.REDIRECT_URI;

  async getToken(code: string, state: string): Promise<SpotifyTokenResponse> {
    const authOptions: AxiosRequestConfig = {
      method: "post",
      url: "/token",
      params: {
        code: code,
        redirect_uri: this.REDIRECT_URI,
        grant_type: "authorization_code",
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
      },
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(this.CLIENT_ID + ":" + this.CLIENT_SECRET).toString(
            "base64"
          ),
      },
    };
    return await httpRequest<SpotifyTokenResponse>(authOptions);
  }

  async getRefreshedToken(refreshToken: string): Promise<SpotifyTokenResponse> {
    const authOptions: AxiosRequestConfig = {
      method: "post",
      url: "/token",
      params: {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      },
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(this.CLIENT_ID + ":" + this.CLIENT_SECRET).toString(
            "base64"
          ),
      },
    };
    return await httpRequest<SpotifyTokenResponse>(authOptions);
  }
}
