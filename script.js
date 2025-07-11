
// List of supported languages
const supportedLanguages = ['en', 'es', 'fr', 'de'];

// Detect browser language
function detectBrowserLanguage() {
  const lang = navigator.language || navigator.userLanguage; // e.g., 'en-US'
  const shortLang = lang.split('-')[0]; // Just 'en', 'es', etc.

  return supportedLanguages.includes(shortLang) ? shortLang : 'en'; // fallback to English
}

document.addEventListener('DOMContentLoaded', () => {
  
  // Language selector setup (works across multiple pages)
  const languageSelector =
    document.getElementById("language-select") ||
    document.getElementById("targetLanguage") ||
    document.getElementById("signin-language-select") ||
    document.getElementById("register-language-select") ||
    document.getElementById("contacts-language-select");

  const detectedLang = detectBrowserLanguage();
  const getPreferredLanguage = () => localStorage.getItem('preferredLanguage') || detectedLang || 'en';

  // Translation elements setup
  const inputText = document.querySelector('.input-area input');
  const translateButton = document.querySelector('.input-area button');
  const translatedText = document.querySelector('.message-area');
  const loadingIndicator = document.createElement('div');

  if (languageSelector) {
    languageSelector.value = detectedLang;
    updateLanguageUI(languageSelector.value);

    languageSelector.addEventListener("change", (e) => {
      updateLanguageUI(e.target.value);
    });
  } else {
    updateLanguageUI(detectedLang);
  }

  // Translation input logic (only runs if on a page with these elements)
  const inputText = document.querySelector('.input-area input');
  const targetLanguage = document.getElementById('targetLanguage');
  const translateButton = document.querySelector('.input-area button');
  const translatedText = document.querySelector('.message-area');
  const loadingIndicator = document.createElement('div');
  loadingIndicator.classList.add('loading-indicator', 'hidden');
  if (translatedText) {
    translatedText.appendChild(loadingIndicator);
  }

  if (inputText && targetLanguage && translateButton && translatedText) {
    translateButton.addEventListener('click', async () => {
      const text = inputText.value.trim();
      const lang = getPreferredLanguage(); // Uses stored or default language

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

        const apiKey = "AIzaSyCuMBNIcuXj3njv2T3wAw8bajABxcuOsCU";
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

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          
          let translatedTextContent = result.candidates[0].content.parts[0].text;

          // Clean up the response - remove common prefixes
          translatedTextContent = translatedTextContent.replace(/^Translation:\s*/i, '');
          translatedTextContent = translatedTextContent.replace(/^Here's the translation:\s*/i, '');
          translatedTextContent = translatedTextContent.replace(/^The translation is:\s*/i, '');
          translatedTextContent = translatedTextContent.replace(/^Translated text:\s*/i, '');
          translatedTextContent = translatedTextContent.replace(/^In \w+:\s*/i, '');
          translatedTextContent = translatedTextContent.replace(/^["']|["']$/g, '');
          translatedTextContent = translatedTextContent.trim();

          const messageDiv = document.createElement('div');
          messageDiv.textContent = translatedTextContent;
          messageDiv.className = 'translated-message';
          translatedText.appendChild(messageDiv);
        } else {
          const errorDiv = document.createElement('div');
          errorDiv.textContent = 'Translation failed: No valid response from API.';
          errorDiv.className = 'error-message';
          translatedText.appendChild(errorDiv);
        }

      } catch (error) {
        console.error('Error during translation:', error);
        const errorDiv = document.createElement('div');
        errorDiv.textContent = `Translation error: ${error.message}. Please try again.`;
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

    // Translation dictionary
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
    backToSigninButton: "Back to Sign In"
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
    backToSigninButton: "Volver a Iniciar sesión"
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
    backToSigninButton: "Retour à la connexion"
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
    backToSigninButton: "Zurück zur Anmeldung"
  }
};


// Shared function
function updateLanguageUI(lang) {
  const t = translations[lang] || translations.en;

    // Settings page elements
    document.getElementById("settings-title")?.textContent = t.settingsTitle;
    document.getElementById("back-button-label")?.textContent = t.backToChat;
    document.getElementById("preferences-heading")?.textContent = t.preferences;
    if (document.getElementById("language-label")) {
        document.getElementById("language-label").childNodes[0].textContent = t.languageLabel + " ";
    }

    // Chat page elements
    document.getElementById("contact-name")?.textContent = t.contactName;
    document.getElementById("contact-label")?.textContent = t.contactName;
    document.getElementById("contact-language-label")?.textContent = t.contactLanguage;
    document.getElementById("contacts-button")?.textContent = t.contacts;
    document.getElementById("settings-button")?.textContent = t.settings;
    document.getElementById("logout-button")?.textContent = t.logout;
    document.getElementById("send-button")?.textContent = t.send;
        // Sign In Page
    document.getElementById("signin-title")?.textContent = t.signinTitle;
    document.getElementById("signin-button")?.textContent = t.signinButton;
    document.getElementById("create-account-button")?.textContent = t.createAccount;
    document.getElementById("username")?.setAttribute("placeholder", t.username);
    document.getElementById("password")?.setAttribute("placeholder", t.password);
  // Register page
    document.getElementById("register-title")?.textContent = t.registerTitle;
    document.getElementById("register-username")?.setAttribute("placeholder", t.registerUsername);
    document.getElementById("register-email")?.setAttribute("placeholder", t.registerEmail);
    document.getElementById("register-password")?.setAttribute("placeholder", t.registerPassword);
    document.getElementById("register-confirm-password")?.setAttribute("placeholder", t.registerConfirmPassword);
    document.getElementById("register-button")?.textContent = t.registerButton;
    document.getElementById("back-to-signin-button")?.textContent = t.backToSigninButton;
    // Contacts page
    document.getElementById("contacts-title")?.textContent = t.contactsTitle;
    document.getElementById("back-to-chat-button")?.textContent = `← ${t.backToChat}`;
    document.getElementById("contactNameInput")?.setAttribute("placeholder", t.addContactPlaceholder);
    document.getElementById("add-contact-button")?.textContent = t.addContactButton;
  const input = document.getElementById("message-input");
  if (input) input.placeholder = t.messagePlaceholder;
}
