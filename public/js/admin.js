import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, getDocs, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js'
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD1bAciW8I08k6avtQVwJjePEVjSwOuNbM",
    authDomain: "gincana-sinodal.firebaseapp.com",
    projectId: "gincana-sinodal",
    storageBucket: "gincana-sinodal.appspot.com",
    messagingSenderId: "414057746840",
    appId: "1:414057746840:web:1da84003c52448a9249bed",
    measurementId: "G-YWQW4SYTVR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth();

document.getElementById("login-btn").style.animation = "vote-enabled .25s ease forwards";
document.getElementById("password-input").onkeydown = () => {
    document.getElementById("warning-auth").innerHTML = "";
    document.getElementById("password-input").style.boxShadow = "none";
}
document.getElementById("login-btn").onclick = async () => {
    document.getElementById("login-btn").style.animation = "vote .25s ease forwards";
    signInWithEmailAndPassword(auth, document.getElementById("email-input").value, document.getElementById("password-input").value).then((userCredential) => {
        document.getElementById("auth").style.display = "none";
        document.getElementById("background-admin").style.display = "flex";
    }).catch((error) => {
        document.getElementById("password-input").style.boxShadow = "0 0 2px 2px rgb(216, 43, 43)";
        document.getElementById("warning-auth").innerHTML = "Senha incorreta";
        document.getElementById("login-btn").style.animation = "vote-enabled .25s ease forwards";
    });
}

document.getElementById("delete-first").onclick = async () => {
    document.getElementById("delete-first").style.animation = "vote .25s ease forwards";
    setTimeout(() => {
        document.getElementById("master-warning").style.display = "flex";
        document.getElementById("relative").style.height = "180px";
        document.getElementById("delete-first").style.animation = "none";
    }, 300);
}

document.getElementById("delete-btn").onclick = async () => {
    document.getElementById("delete-btn").style.animation = "vote .25s ease forwards";
    setTimeout(() => {
        document.getElementById("master-warning").style.display = "none";
        document.getElementById("delete-btn").style.animation = "none";
        document.getElementById("relative").style.height = "auto";
    }, 300);
    const docsSnap = await getDocs(collection(db, "votes"));
    console.log(docsSnap.docs);
    docsSnap.docs.forEach(async doc => {
        deleteDoc(doc.ref);
    });
}

onSnapshot(doc(db, "settings", "vote-settings"), async (querySnapshot) => {
    document.getElementById("voteOpen-input").checked = querySnapshot.data().open;
    document.getElementById("voteType-input").value = querySnapshot.data().votingType;
    document.getElementById("timeout-input").value = querySnapshot.data().timeout;
    document.getElementById("voteOptions-input").value = querySnapshot.data().voteOptions;
    document.getElementById("warningMsg-input").value = querySnapshot.data().warningClosed;
    document.getElementById("welcomeMsg-input").value = querySnapshot.data().welcomeMessage;
    document.getElementById("save-btn").style.animation = "vote-enabled .25s ease forwards";
    document.getElementById("save-btn").onclick = async () => {
        document.getElementById("save-btn").style.animation = "vote .25s ease forwards";
        await updateDoc(doc(db, "settings", "vote-settings"), {
            open: document.getElementById("voteOpen-input").checked,
            timeout: document.getElementById("timeout-input").value,
            voteOptions: document.getElementById("voteOptions-input").value,
            votingType: document.getElementById("voteType-input").value,
            warningClosed: document.getElementById("warningMsg-input").value,
            welcomeMessage: document.getElementById("welcomeMsg-input").value
        });
        setTimeout(() => {
            document.getElementById("save-btn").style.animation = "vote-enabled .25s ease forwards";
        }, 500);
    };
});