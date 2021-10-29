import express, { Request } from "express";
import cors from "cors";
import { stringify } from "query-string";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import dotenv from "dotenv";
import { SpotifyTokenResponse } from "./models/SpotifyTokenResponse";
import { fs } from "./firebase_config";
import FirebaseService from "./services/FirebaseService";

dotenv.config();

const app: express.Application = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const firebaseService = new FirebaseService(fs);

const spotifyApi = axios.create({
  baseURL: "https://accounts.spotify.com/api",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
let userId = "";

async function httpRequest<T>(config: AxiosRequestConfig): Promise<T> {
  return await spotifyApi(config)
    .then((res: AxiosResponse<T>) => {
      return res.data;
    })
    .catch((error: any) => {
      console.log(error);
      return error;
    });
}

app.get(
  "/login",
  function (
    req: Request<{}, any, any, { userId: string }, Record<string, any>>,
    res
  ) {
    userId = req.query.userId;
    console.log(userId);
    const state = "dhdhdhdhdh";
    const scope = "user-read-private user-read-email";

    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        stringify({
          response_type: "code",
          client_id: CLIENT_ID,
          scope: scope,
          redirect_uri: REDIRECT_URI,
          state: state,
        })
    );
  }
);

app.get("/callback", async function (req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    res.redirect(
      "/#" +
        stringify({
          error: "state_mismatch",
        })
    );
  } else {
    const authOptions: AxiosRequestConfig = {
      method: "post",
      url: "/token",
      params: {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      },
    };
    const response = await httpRequest<SpotifyTokenResponse>(authOptions);
    firebaseService.setAuthToken(
      response.access_token,
      response.refresh_token,
      userId
    );
    res.status(200).send("<script>window.close()</script>");
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}`));
