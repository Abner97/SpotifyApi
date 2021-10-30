import { ServiceRenewTokenResponse } from "../models/ServiceRenewTokenResponse";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  Firestore,
  getDoc,
  setDoc,
} from "firebase/firestore";

export default class FirebaseService {
  constructor(private fireStore: Firestore) {}

  async setAuthToken(accesToken: string, nextToken: string, userId: string) {
    try {
      const tokenID = await this.getTokenStoreID(userId);
      if (tokenID) {
        const tokenRef = doc(this.fireStore, "usersTokens", tokenID);
        await setDoc(tokenRef, { accesToken, nextToken });
        console.log(`Token update succesfully on ${tokenRef.id}`);
      } else {
        const docRef = await addDoc(collection(this.fireStore, "usersTokens"), {
          accesToken,
          nextToken,
        });

        console.log("Tokens written with ID: ", docRef.id);

        const userRef = await setDoc(
          doc(this.fireStore, "users", userId),
          {
            tokensStoreID: docRef.id,
          },
          { merge: true }
        );

        console.log("Document written with ID: ", userRef);
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async updateAccessToken(
    newAccessToken: string,
    userId: string
  ): Promise<boolean> {
    const tokenID = await this.getTokenStoreID(userId);
    try {
      await setDoc(
        doc(this.fireStore, "usersTokens", tokenID),
        {
          accessToken: newAccessToken,
        },
        { merge: true }
      );
      console.log(`Access token successfully updated `);
      return true;
    } catch {
      return false;
    }
  }

  private async getDocumentData(
    collection: string,
    document: string
  ): Promise<DocumentData> {
    const docRef = doc(this.fireStore, collection, document);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return {};
    }
  }

  private async getTokenStoreID(userId: string): Promise<string> {
    const response = await this.getDocumentData("users", userId);
    return response.tokensStoreID;
  }

  async getUserRenewToken(
    userId: string
  ): Promise<ServiceRenewTokenResponse | null> {
    const tokenStoreId = await this.getTokenStoreID(userId);
    if (tokenStoreId) {
      const response = await this.getDocumentData("usersTokens", tokenStoreId);
      return { refreshToken: response.nextToken, tokenStoreId };
    } else {
      return null;
    }
  }
}
