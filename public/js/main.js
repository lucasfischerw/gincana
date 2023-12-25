import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js'

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

var votingType = -1;
var originalVotingType = -1;

onSnapshot(doc(db, "settings", "vote-settings"), async (querySnapshot) => {
    votingType = querySnapshot.data().votingType;
    if(originalVotingType != votingType) {
        document.getElementById("results-graph").innerHTML = "";
        originalVotingType = querySnapshot.data().votingType;
        var voteOptions = querySnapshot.data().voteOptions.split(/\s*,\s*/);
        if (votingType == 2) {
            voteOptions = Array.from({ length: 10 }, (_, i) => i + 1)
        }
        for (let index = 0; index < voteOptions.length; index++) {
            var graphContainer = document.createElement("div");
            graphContainer.classList.add("graph-container");
            var graph = document.createElement("div");
            graph.classList.add("graph");
            var h2 = document.createElement("h2");
            h2.innerHTML = voteOptions[index];
            var p = document.createElement("p");
            p.innerHTML = "0 votos";
            graphContainer.appendChild(graph);
            graphContainer.appendChild(h2);
            graphContainer.appendChild(p);
            document.getElementById("results-graph").appendChild(graphContainer);
        }
    }
});

onSnapshot(collection(db, "votes"), async (querySnapshot) => {
    var docRef = await getDoc(doc(db, "settings", "vote-settings"));
    var voteOptions = docRef.data().voteOptions.split(/\s*,\s*/);
    if (docRef.data().votingType == 2) {
        voteOptions = Array.from(Array(11).keys());
    }
    var voteResults = new Array(voteOptions.length).fill(0);
    
    querySnapshot.forEach((doc) => {
        voteResults.splice((doc.data().selectedOptionID), 1, voteResults[doc.data().selectedOptionID] + 1);
    });

    console.log(voteResults);

    var votosTotais = 0;
    for (let index = 0; index < voteOptions.length; index++) {
        votosTotais += voteResults[index];
    }

    if (docRef.data().votingType == 2) {
        var somaTotal = 0;
        for (let index = 0; index < voteOptions.length; index++) {
            somaTotal += (voteOptions[index]+1) * voteResults[index];
        }
        if (votosTotais == 0) {
            somaTotal = 0;
        } else {
            somaTotal = somaTotal/votosTotais;
        }

        document.getElementById("notaMedia").innerHTML = "Nota média: " + somaTotal.toFixed(2);
    } else {
        document.getElementById("notaMedia").innerHTML = "";
    }
    
    document.getElementById("votosTotais").innerHTML = "Número total de votos: " +  votosTotais;

    var maxValue = Math.max(...voteResults);

    document.querySelectorAll('.graph-container').forEach((element, index) => {
        if(maxValue == 0) {
            document.getElementsByClassName("graph-container")[index].children[0].style.height = "0px";
        } else {
            document.getElementsByClassName("graph-container")[index].children[0].style.height = (voteResults[index] / maxValue) * 190 + "px";
        }
        document.getElementsByClassName("graph-container")[index].children[2].innerHTML = voteResults[index] + " votos";
    })
});