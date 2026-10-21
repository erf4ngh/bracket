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
  // Who can make brackets: SHA-256 hashes of their lowercased Google email, so the addresses aren't published.
  // Make one with: printf '%s' 'you@gmail.com' | shasum -a 256
  // Keep this list the same as the one in firestore.rules (that one is what the database enforces).
  admins: [
    "b8cd0fce3dc669277a666745a300d94a810641e2576f00b14e6248153e023137",
    "556bc93078d4f26e0bebf957d0a7d9c414d8b6162fdf166b0649d6b27d237532",
  ],
};
