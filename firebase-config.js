import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyALPLGbzw_f-towKokoTc3UNC9nOU7vfCg",
    authDomain: "splitbill-75975.firebaseapp.com",
    projectId: "splitbill-75975",
    storageBucket: "splitbill-75975.firebasestorage.app",
    messagingSenderId: "593132247381",
    appId: "1:593132247381:web:adea0cef1dc69dfdc1b7dc"
};

let app, auth, db, provider;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    provider = new GoogleAuthProvider();
} catch (error) {
    console.error("Firebase 初始化失敗:", error);
}

export { app, auth, db, provider };
