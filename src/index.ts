import express, { Request, Response } from "express";
import cors from "cors";
import { stringify } from "query-string";
import { fs } from "./firebase_config";
import FirebaseService from "./services/FirebaseService";
import { RenewModel } from "./models/RenewModel";
import Errors from "./config/Errors";
import dotenv from "dotenv";
import SpotifyService from "./services/SpotifyService";

dotenv.config();

const app: express.Application = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const firebaseService = new FirebaseService(fs);
const spotifyService = new SpotifyService();

let userId = "";

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
          client_id: spotifyService.CLIENT_ID,
          scope: scope,
          redirect_uri: spotifyService.REDIRECT_URI,
          state: state,
        })
    );
  }
);

app.get("/callback", async function (req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null || code === null) {
    res.redirect(
      "/#" +
        stringify({
          error: "state_mismatch",
        })
    );
  } else {
    const tokenResponse = await spotifyService.getToken(
      code.toString(),
      state.toString()
    );

    firebaseService.setAuthToken(
      tokenResponse.access_token,
      tokenResponse.refresh_token!,
      userId
    );
    console.log(tokenResponse);
    res.status(200).send("<script>window.close()</script>");
  }
});

app.post(
  "/renew-token",
  async (req: Request<{}, {}, RenewModel>, res: Response) => {
    const userID = req.body.userID;
    if (!userID) {
      res.status(401).send(Errors.INVALID_USER);
    } else {
      const refreshToken = await firebaseService.getUserRenewToken(userID);
      if (refreshToken) {
        const newAccessToken = await spotifyService.getRefreshedToken(
          refreshToken.refreshToken
        );

        const tokenUpdatedOnDB = await firebaseService.updateAccessToken(
          refreshToken.refreshToken,
          refreshToken.tokenStoreId
        );
        console.log(newAccessToken);
        if (tokenUpdatedOnDB) {
          res.status(200).send({ newAccessToken });
        } else {
          res.status(500).send({ error: "Algo Salio Mal" });
        }
      } else {
        res.status(500).send({ error: "Algo Salio Mal" });
      }
    }
  }
);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}`));
