import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCOkLbaXpbYcfzktkYVx1qzJiFu0-9dTuU",
  authDomain: "todoproject-4feb5.firebaseapp.com",
  projectId: "todoproject-4feb5",
  storageBucket: "todoproject-4feb5.firebasestorage.app",
  messagingSenderId: "779193173501",
  appId: "1:779193173501:web:2689cad43b4ee17f16c594",
  measurementId: "G-Y3FZCRNPM0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


window.db = db;
window.firebaseFirestore = { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where };
