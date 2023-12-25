// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js"
import { getFirestore, collection, doc, setDoc, onSnapshot, updateDoc, deleteDoc, getDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js'
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1bAciW8I08k6avtQVwJjePEVjSwOuNbM",
  authDomain: "gincana-sinodal.firebaseapp.com",
  projectId: "gincana-sinodal",
  storageBucket: "gincana-sinodal.appspot.com",
  messagingSenderId: "414057746840",
  appId: "1:414057746840:web:1da84003c52448a9249bed",
  measurementId: "G-YWQW4SYTVR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = getFirestore(app);

var voteEnabled = true;

onSnapshot(doc(db, "settings", "vote-settings"), (querySnapshot) => {
  if (querySnapshot.data().open) {
    document.getElementById("main-container").style.display = "flex";
    document.getElementById("closed").style.display = "none";
  } else {
    document.getElementById("main-container").style.display = "none";
    document.getElementById("waringClosed").innerHTML = querySnapshot.data().warningClosed;
    document.getElementById("closed").style.display = "flex";
  }

  document.getElementById("vote-type").innerHTML = "";
  document.getElementById("welcome-message").innerHTML = querySnapshot.data().welcomeMessage;
  var voteOptions = querySnapshot.data().voteOptions.split(/\s*,\s*/);

  if (querySnapshot.data().votingType == 0 && querySnapshot.data().open) {
    //Votação de Múltipla escolha
    var selectElement = document.createElement("select");
    selectElement.id = "vote-options";
    document.getElementById("vote-type").appendChild(selectElement);

    var votingButton = document.createElement("button");
    votingButton.id = "vote-btn";
    votingButton.innerHTML = "Votar";
    document.getElementById("vote-type").appendChild(votingButton);

    document.getElementById("vote-options").innerHTML = "";
    var optionElement = document.createElement("option");
    optionElement.value = -1;
    optionElement.innerHTML = "Selecione uma opção";
    document.getElementById("vote-options").appendChild(optionElement);
    voteOptions.forEach((option, index) => {
      var optionElement = document.createElement("option");
      optionElement.value = index;
      optionElement.innerHTML = option;
      document.getElementById("vote-options").appendChild(optionElement);
    });

    document.getElementById("vote-options").addEventListener("change", function () {
      if (document.getElementById("vote-options").value != -1 && voteEnabled) {
        document.getElementById("vote-btn").style.animation = "vote-enabled .25s ease forwards";
      } else {
        document.getElementById("vote-btn").style.animation = "vote-disabled .25s ease forwards";
      }
    });

    document.getElementById("vote-btn").addEventListener("click", async function () {
      if (voteEnabled && document.getElementById("vote-options").value != -1) {
        voteEnabled = false;
        document.getElementById("vote-btn").style.animation = "vote .35s ease forwards";
        await setDoc(doc(collection(db, "votes")), {
          selectedOptionName: document.getElementsByTagName("option")[document.getElementById("vote-options").value].innerHTML,
          selectedOptionID: document.getElementById("vote-options").value
        });
        setTimeout(async () => {
          var docRef = await getDoc(doc(db, "settings", "vote-settings"));
          if (docRef.data().timeout > 0) {
            document.getElementById("warning").style.display = "block";
            document.getElementById("warning").style.opacity = "1";
            document.getElementById("slider").style.transition = "width " + docRef.data().timeout / 1000 + "s linear";
            document.getElementById("slider").style.width = "100%";
            setTimeout(() => {
              document.getElementById("slider").style.transition = "width .25s linear";
              document.getElementById("slider").style.width = "0";
              document.getElementById("vote-btn").style.animation = "vote-enabled .25s ease forwards";
              document.getElementById("warning").style.opacity = "0";
              setTimeout(() => {
                voteEnabled = true;
                document.getElementById("warning").style.display = "none";
              }, 300);
            }, docRef.data().timeout);
          } else {
            document.getElementById("vote-btn").style.animation = "vote-enabled .25s ease forwards";
            setTimeout(() => {
              voteEnabled = true;
            }, 250);
          }
        }, 350);
      }
    });
  } else if(querySnapshot.data().votingType == 1 && querySnapshot.data().open) {
    voteOptions.forEach((option, index) => {
      var buttonElement = document.createElement("button");
      buttonElement.id = "vote-btn";
      buttonElement.innerHTML = option;
      buttonElement.style.animation = "vote-enabled .25s ease forwards";
      buttonElement.onclick = async function() {
        if(voteEnabled) {
          voteEnabled = false;
  
          Array.from(document.getElementsByTagName("button")).forEach((button) => {
            button.style.animation = "vote-disabled .25s ease forwards";
          });
          buttonElement.style.animation = "vote .35s ease forwards";
  
          await setDoc(doc(collection(db, "votes")), {
           selectedOptionName: option,
           selectedOptionID: index
          });
  
          setTimeout(async () => {
            var docRef = await getDoc(doc(db, "settings", "vote-settings"));
            if (docRef.data().timeout > 0) {
              document.getElementById("warning").style.display = "block";
              document.getElementById("warning").style.opacity = "1";
              document.getElementById("slider").style.transition = "width " + docRef.data().timeout / 1000 + "s linear";
              document.getElementById("slider").style.width = "100%";
              setTimeout(() => {
                document.getElementById("slider").style.transition = "width .25s linear";
                document.getElementById("slider").style.width = "0";
                Array.from(document.getElementsByTagName("button")).forEach((button) => {
                  button.style.animation = "vote-enabled .25s ease forwards";
                });
                document.getElementById("warning").style.opacity = "0";
                setTimeout(() => {
                  voteEnabled = true;
                  document.getElementById("warning").style.display = "none";
                }, 300);
              }, docRef.data().timeout);
            } else {
              Array.from(document.getElementsByTagName("button")).forEach((button) => {
                button.style.animation = "vote-enabled .25s ease forwards";
              });
              setTimeout(() => {
                voteEnabled = true;
              }, 250);
            }
          }, 350);

        }
      }
      document.getElementById("vote-type").appendChild(buttonElement);
    });
    voteEnabled = true;
  } else if (querySnapshot.data().votingType == 2 && querySnapshot.data().open) {
    var selectedValueText = document.createElement("h3");
    selectedValueText.id = "text-value"
    document.getElementById("vote-type").appendChild(selectedValueText);

    var slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "90";
    slider.oninput = () => {
      console.log(slider.value);
      document.getElementById("text-value").innerHTML = "Nota selecionada: " + (Math.round(slider.value/10) + 1);
    }
    document.getElementById("vote-type").appendChild(slider);
    document.getElementById("text-value").innerHTML = "Nota selecionada: " + (Math.round(slider.value / 10) + 1);

    var votingButton = document.createElement("button");
    votingButton.id = "vote-btn";
    votingButton.innerHTML = "Votar";
    document.getElementById("vote-type").appendChild(votingButton);

    document.getElementById("vote-btn").style.animation = "vote-enabled .25s ease forwards";

    document.getElementById("vote-btn").addEventListener("click", async function () {
      if (voteEnabled) {
        voteEnabled = false;
        document.getElementById("vote-btn").style.animation = "vote .35s ease forwards";
        await setDoc(doc(collection(db, "votes")), {
          selectedOptionName: Math.round(slider.value / 10),
          selectedOptionID: Math.round(slider.value / 10)
        });
        setTimeout(async () => {
          var docRef = await getDoc(doc(db, "settings", "vote-settings"));
          if (docRef.data().timeout > 0) {
            document.getElementById("warning").style.display = "block";
            document.getElementById("warning").style.opacity = "1";
            document.getElementById("slider").style.transition = "width " + docRef.data().timeout / 1000 + "s linear";
            document.getElementById("slider").style.width = "100%";
            setTimeout(() => {
              document.getElementById("slider").style.transition = "width .25s linear";
              document.getElementById("slider").style.width = "0";
              document.getElementById("vote-btn").style.animation = "vote-enabled .25s ease forwards";
              document.getElementById("warning").style.opacity = "0";
              setTimeout(() => {
                voteEnabled = true;
                document.getElementById("warning").style.display = "none";
              }, 300);
            }, docRef.data().timeout);
          } else {
            document.getElementById("vote-btn").style.animation = "vote-enabled .25s ease forwards";
            setTimeout(() => {
              voteEnabled = true;
            }, 250);
          }
        }, 350);
      }
    });
  }
});
