// Firebase Config

const firebaseConfig = {
  apiKey: "AIzaSyBblnVz1SYbUGHfrAeFKte0-s4dRwrNLKM",
  authDomain: "mysite-project-77071.firebaseapp.com",
  projectId: "mysite-project-77071",
  appId: "1:53846467224:web:171ebaa2ae19ab1a9166ed"
};

// Initialize Firebase safely
if (typeof firebase !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
