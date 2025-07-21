import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Reuse existing Firebase initialization (skip re-initializing)
const db = getFirestore();
const auth = getAuth();

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

async function addContact() {
  const input = document.getElementById("contactName");
  const name = input.value.trim();
  if (!name || !userId) return;

  const contactsRef = collection(db, "users", userId, "contacts");
  await addDoc(contactsRef, { name });

  input.value = "";
  loadContacts();
}

function selectContact(id, name) {
  const items = document.querySelectorAll(".contact-item");
  items.forEach(el => {
    el.classList.toggle("selected", el.textContent === name);
  });

  console.log("Selected contact:", name, "(id:", id + ")");
}
