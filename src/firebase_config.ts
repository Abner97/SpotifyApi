import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxo09y0-hpFHh4ifeaXB6TQJIEtpSbiIc",
  authDomain: "spotifyapp-a237f.firebaseapp.com",
  projectId: "spotifyapp-a237f",
  storageBucket: "spotifyapp-a237f.appspot.com",
  messagingSenderId: "99783908206",
  appId: "1:99783908206:web:4b4caf3223e2dd35d77f7f",
  measurementId: "G-9CXHFFB2PS",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const fs = getFirestore(firebaseApp);
//const analytics = getAnalytics(app);
