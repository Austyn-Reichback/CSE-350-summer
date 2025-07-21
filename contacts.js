import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCfeovprG-VnbApfAuMGq11H5rdyU-LJuQ",
        authDomain: "translator-app-d31d1.firebaseapp.com",
        projectId: "translator-app-d31d1",
        storageBucket: "translator-app-d31d1.firebasestorage.app",
        messagingSenderId: "969041217859",
        appId: "1:969041217859:web:0df2b9d0850c4097e987f6",
        measurementId: "G-DGT3QCMV61"
      };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let userId = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;
    loadContacts();
  } else {
    alert("Please log in to see contacts.");
  }
});

async function loadContacts() {
  const contactList = document.getElementById("contactList");
  contactList.innerHTML = "";

  const contactsRef = collection(db, "users", userId, "contacts");
  const snapshot = await getDocs(contactsRef);

  snapshot.forEach(doc => {
    const contact = doc.data();
    const div = document.createElement("div");
    div.className = "contact-item";
    div.textContent = contact.name;
    div.onclick = () => selectContact(doc.id, contact.name);
    contactList.appendChild(div);
  });
}

function selectContact(id, name) {
  const items = document.querySelectorAll(".contact-item");
  items.forEach(el => {
    el.classList.toggle("selected", el.textContent === name);
  });

  console.log("Selected contact:", name, "(id:", id + ")");
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("addContactBtn");
  if (btn) {
    btn.addEventListener("click", addContact);
  }
});