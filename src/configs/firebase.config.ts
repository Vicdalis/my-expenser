import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD1hgZC9QAsiPMwvjRLWBw8NI4vReEvZNo",
    authDomain: "my-expenser.firebaseapp.com",
    databaseURL: "https://my-expenser-default-rtdb.firebaseio.com",
    projectId: "my-expenser",
    storageBucket: "my-expenser.appspot.com",
    messagingSenderId: "156462052965",
    appId: "1:156462052965:web:3e9b72574b779c9306b88c",
    measurementId: "G-RR7M5CSMHE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {app, db, auth,};

