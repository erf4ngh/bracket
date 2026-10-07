// Connects the site to your Firebase project so brackets, picks and accounts are shared.
// Paste the "firebaseConfig" values from Firebase console > Project settings > Your apps.
// These values are not secrets: firestore.rules decides who can read and write.
// Leave firebase as null and the site still works, but everything stays in each person's browser.
window.TB_CONFIG = {
  firebase: null,
  // firebase: {
  //   apiKey: "…",
  //   authDomain: "your-project.firebaseapp.com",
  //   projectId: "your-project",
  //   appId: "…",
  // },
};
