import { auth, db } from './firebase.js';
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
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