document.addEventListener('DOMContentLoaded', function() {
  // Firebase configuration (use your actual config)
  const firebaseConfig = {
    apiKey: "AIzaSyCfeovprG-VnbApfAuMGq11H5rdyU-LJuQ",
    authDomain: "translator-app-d31d1.firebaseapp.com",
    projectId: "translator-app-d31d1",
    storageBucket: "translator-app-d31d1.appspot.com",
    messagingSenderId: "969041217859",
    appId: "1:969041217859:web:0df2b9d0850c4097e987f6",
    measurementId: "G-DGT3QCMV61"
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  document.getElementById('register-button').addEventListener('click', async function() {
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const messageElement = document.getElementById('register-message');

    messageElement.textContent = '';
    messageElement.className = '';

    if (!username || !email || !password || !confirmPassword) {
      messageElement.textContent = 'Please fill in all fields.';
      messageElement.className = 'error';
      return;
    }

    if (password !== confirmPassword) {
      messageElement.textContent = 'Passwords do not match.';
      messageElement.className = 'error';
      return;
    }

    if (password.length < 6) {
      messageElement.textContent = 'Password should be at least 6 characters.';
      messageElement.className = 'error';
      return;
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      // Optionally, update the user's display name
      await userCredential.user.updateProfile({ displayName: username });

      messageElement.textContent = 'Account created successfully! Redirecting to sign in...';
      messageElement.className = 'success';

      setTimeout(() => {
        window.location.href = 'signin.html';
      }, 2000);
    } catch (error) {
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email address is already in use.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }
      messageElement.textContent = errorMessage;
      messageElement.className = 'error';
    }
  });
});