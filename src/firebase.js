import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBnv6m4B6hUvdeuOLuz1tu8NQSvTHfsELo",
    authDomain: "ileadhq.firebaseapp.com",
    projectId: "ileadhq",
    storageBucket: "ileadhq.firebasestorage.app",
    messagingSenderId: "671431346489",
    appId: "1:671431346489:web:27519a8fdce7aa5b6a40e8",
    measurementId: "G-V8B3SLR715"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);