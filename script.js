// Supported languages
const supportedLanguages = ['en', 'es', 'fr', 'de'];

// Detect browser language
function detectBrowserLanguage() {
  const lang = navigator.language || navigator.userLanguage; // e.g., 'en-US'
  const shortLang = lang.split('-')[0];
  return supportedLanguages.includes(shortLang) ? shortLang : 'en';
}

document.addEventListener('DOMContentLoaded', () => {
  // Language selector logic
  const languageSelector =
    document.getElementById("language-select") ||
    document.getElementById("targetLanguage") ||
    document.getElementById("signin-language-select") ||
    document.getElementById("register-language-select") ||
    document.getElementById("contacts-language-select");

  const savedLang = localStorage.getItem("preferredLanguage");
  const detectedLang = savedLang || detectBrowserLanguage();

  if (languageSelector) {
    languageSelector.value = detectedLang;
    updateLanguageUI(detectedLang);

    languageSelector.addEventListener("change", (e) => {
      const selectedLang = e.target.value;
      localStorage.setItem("preferredLanguage", selectedLang);
      updateLanguageUI(selectedLang);
    });
  } else {
    updateLanguageUI(detectedLang);
  }

  // Chat translation logic
  const inputText = document.querySelector('.input-area input');
  const targetLanguage = document.getElementById('targetLanguage');
  const translateButton = document.querySelector('.input-area button');
  const translatedText = document.querySelector('.message-area');
  const loadingIndicator = document.createElement('div');
  loadingIndicator.classList.add('loading-indicator', 'hidden');
  if (translatedText) translatedText.appendChild(loadingIndicator);

  if (inputText && targetLanguage && translateButton && translatedText) {
    translateButton.addEventListener('click', async () => {
      const text = inputText.value.trim();
      const lang = targetLanguage.value;

      if (!text) {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = 'Please enter text to translate.';
        errorDiv.className = 'error-message';
        translatedText.appendChild(errorDiv);
        return;
      }

      translatedText.innerHTML = '';
      loadingIndicator.classList.remove('hidden');
      translateButton.disabled = true;

      try {
        const payload = {
          contents: [{
            role: "user",
            parts: [{ text: `Translate this text to ${lang}. Return only the translation, no additional text: ${text}` }]
          }]
        };

        const apiKey = "YOUR_API_KEY_HERE"; // Replace this with a valid API key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API error: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
        }

        const result = await response.json();

        if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
          let translatedTextContent = result.candidates[0].content.parts[0].text;

          translatedTextContent = translatedTextContent
            .replace(/^Translation:\s*/i, '')
            .replace(/^Here's the translation:\s*/i, '')
            .replace(/^The translation is:\s*/i, '')
            .replace(/^Translated text:\s*/i, '')
            .replace(/^In \w+:\s*/i, '')
            .replace(/^["']|["']$/g, '')
            .trim();

          const messageDiv = document.createElement('div');
          messageDiv.textContent = translatedTextContent;
          messageDiv.className = 'translated-message';
          translatedText.appendChild(messageDiv);
        } else {
          throw new Error('No valid response from API.');
        }

      } catch (error) {
        console.error('Error during translation:', error);
        const errorDiv = document.createElement('div');
        errorDiv.textContent = `Translation error: ${error.message}`;
        errorDiv.className = 'error-message';
        translatedText.appendChild(errorDiv);
      } finally {
        loadingIndicator.classList.add('hidden');
        translateButton.disabled = false;
      }
    });

    inputText.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        translateButton.click();
      }
    });
  }
});

// Language translation strings
const translations = {
  en: {
    settingsTitle: "Settings",
    backToChat: "Back to Chat",
    preferences: "Preferences",
    languageLabel: "Language:",
    contactName: "Placeholder Contact",
    contactLanguage: "Contact Language",
    send: "Send",
    messagePlaceholder: "Message...",
    contacts: "Contacts",
    settings: "Settings and Preferences",
    logout: "Logout",
    signinTitle: "Welcome to CSE 350 Translator",
    username: "Username",
    password: "Password",
    signinButton: "Sign In",
    createAccount: "Create New Account",
    registerTitle: "Create a New Account",
    registerUsername: "Username",
    registerEmail: "Email",
    registerPassword: "Password",
    registerConfirmPassword: "Confirm Password",
    registerButton: "Register",
    backToSigninButton: "Back to Sign In",
    contactsTitle: "Contacts",
    addContactPlaceholder: "Enter contact name...",
    addContactButton: "Add"
  },
  es: {
    settingsTitle: "Configuración",
    backToChat: "Volver al chat",
    preferences: "Preferencias",
    languageLabel: "Idioma:",
    contactName: "Contacto",
    contactLanguage: "Idioma del contacto",
    send: "Enviar",
    messagePlaceholder: "Mensaje...",
    contacts: "Contactos",
    settings: "Configuración y preferencias",
    logout: "Cerrar sesión",
    signinTitle: "Bienvenido al Traductor CSE 350",
    username: "Nombre de usuario",
    password: "Contraseña",
    signinButton: "Iniciar sesión",
    createAccount: "Crear nueva cuenta",
    registerTitle: "Crear una nueva cuenta",
    registerUsername: "Nombre de usuario",
    registerEmail: "Correo electrónico",
    registerPassword: "Contraseña",
    registerConfirmPassword: "Confirmar contraseña",
    registerButton: "Registrar",
    backToSigninButton: "Volver a Iniciar sesión",
    contactsTitle: "Contactos",
    addContactPlaceholder: "Ingrese el nombre del contacto...",
    addContactButton: "Agregar"
  },
  fr: {
    settingsTitle: "Paramètres",
    backToChat: "Retour au chat",
    preferences: "Préférences",
    languageLabel: "Langue :",
    contactName: "Contact",
    contactLanguage: "Langue du contact",
    send: "Envoyer",
    messagePlaceholder: "Message...",
    contacts: "Contacts",
    settings: "Paramètres et préférences",
    logout: "Se déconnecter",
    signinTitle: "Bienvenue sur le Traducteur CSE 350",
    username: "Nom d'utilisateur",
    password: "Mot de passe",
    signinButton: "Connexion",
    createAccount: "Créer un compte",
    registerTitle: "Créer un nouveau compte",
    registerUsername: "Nom d'utilisateur",
    registerEmail: "E-mail",
    registerPassword: "Mot de passe",
    registerConfirmPassword: "Confirmer le mot de passe",
    registerButton: "S'inscrire",
    backToSigninButton: "Retour à la connexion",
    contactsTitle: "Contacts",
    addContactPlaceholder: "Entrez le nom du contact...",
    addContactButton: "Ajouter"
  },
  de: {
    settingsTitle: "Einstellungen",
    backToChat: "Zurück zum Chat",
    preferences: "Einstellungen",
    languageLabel: "Sprache:",
    contactName: "Kontakt",
    contactLanguage: "Kontaktsprache",
    send: "Senden",
    messagePlaceholder: "Nachricht...",
    contacts: "Kontakte",
    settings: "Einstellungen und Präferenzen",
    logout: "Abmelden",
    signinTitle: "Willkommen beim CSE 350 Übersetzer",
    username: "Benutzername",
    password: "Passwort",
    signinButton: "Anmelden",
    createAccount: "Konto erstellen",
    registerTitle: "Neues Konto erstellen",
    registerUsername: "Benutzername",
    registerEmail: "E-Mail",
    registerPassword: "Passwort",
    registerConfirmPassword: "Passwort bestätigen",
    registerButton: "Registrieren",
    backToSigninButton: "Zurück zur Anmeldung",
    contactsTitle: "Kontakte",
    addContactPlaceholder: "Kontaktnamen eingeben...",
    addContactButton: "Hinzufügen"
  }
};

// Apply translations to elements
function updateLanguageUI(lang) {
  const t = translations[lang] || translations.en;

  document.getElementById("settings-title")?.textContent = t.settingsTitle;
  document.getElementById("back-button-label")?.textContent = t.backToChat;
  document.getElementById("preferences-heading")?.textContent = t.preferences;
  if (document.getElementById("language-label")) {
    document.getElementById("language-label").childNodes[0].textContent = t.languageLabel + " ";
  }

  document.getElementById("contact-name")?.textContent = t.contactName;
  document.getElementById("contact-label")?.textContent = t.contactName;
  document.getElementById("contact-language-label")?.textContent = t.contactLanguage;
  document.getElementById("contacts-button")?.textContent = t.contacts;
  document.getElementById("settings-button")?.textContent = t.settings;
  document.getElementById("logout-button")?.textContent = t.logout;
  document.getElementById("send-button")?.textContent = t.send;
  document.getElementById("signin-title")?.textContent = t.signinTitle;
  document.getElementById("signin-button")?.textContent = t.signinButton;
  document.getElementById("create-account-button")?.textContent = t.createAccount;
  document.getElementById("username")?.setAttribute("placeholder", t.username);
  document.getElementById("password")?.setAttribute("placeholder", t.password);
  document.getElementById("register-title")?.textContent = t.registerTitle;
  document.getElementById("register-username")?.setAttribute("placeholder", t.registerUsername);
  document.getElementById("register-email")?.setAttribute("placeholder", t.registerEmail);
  document.getElementById("register-password")?.setAttribute("placeholder", t.registerPassword);
  document.getElementById("register-confirm-password")?.setAttribute("placeholder", t.registerConfirmPassword);
  document.getElementById("register-button")?.textContent = t.registerButton;
  document.getElementById("back-to-signin-button")?.textContent = t.backToSigninButton;
  document.getElementById("contacts-title")?.textContent = t.contactsTitle;
  document.getElementById("back-to-chat-button")?.textContent = `← ${t.backToChat}`;
  document.getElementById("contactNameInput")?.setAttribute("placeholder", t.addContactPlaceholder);
  document.getElementById("add-contact-button")?.textContent = t.addContactButton;

  const input = document.getElementById("message-input");
  if (input) input.placeholder = t.messagePlaceholder;
}
