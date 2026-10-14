// Connects the site to your Firebase project so brackets, picks and accounts are shared.
// Values come from Firebase console > Project settings > Your apps.
// These values are not secrets: firestore.rules decides who can read and write.
// Set firebase to null and the site still works, but everything stays in each person's browser.
window.TB_CONFIG = {
  firebase: {
    apiKey: "AIzaSyA8DXx0C7oi4HJWccyuXqU1Iy6Lh4MtU4o",
    authDomain: "bracket-fbe29.firebaseapp.com",
    projectId: "bracket-fbe29",
    storageBucket: "bracket-fbe29.firebasestorage.app",
    messagingSenderId: "612526586690",
    appId: "1:612526586690:web:fd08582bc506a2aadce6db",
  },
};
