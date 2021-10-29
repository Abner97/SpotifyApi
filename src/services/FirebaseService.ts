import {
  addDoc,
  collection,
  doc,
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

  private async getTokenStoreID(userId: string): Promise<string> {
    const docRef = doc(this.fireStore, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().tokensStoreID;
    } else {
      throw new Error("Invalid User");
    }
  }
}
