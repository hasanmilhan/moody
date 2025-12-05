/* === Imports === */
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

/* === Firebase Setup === */
const firebaseConfig = {
  apiKey: "AIzaSyABMqMHdFrGyJtUqNodd0bFgRYS-xbJEt8",
  authDomain: "moody-834df.firebaseapp.com",
  projectId: "moody-834df",
  storageBucket: "moody-834df.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

/* === UI === */

/* == UI - Elements == */

const viewLoggedOut = document.getElementById("logged-out-view");
const viewLoggedIn = document.getElementById("logged-in-view");

const signInWithGoogleButtonEl = document.getElementById(
  "sign-in-with-google-btn"
);

const emailInputEl = document.getElementById("email-input");
const passwordInputEl = document.getElementById("password-input");

const signInButtonEl = document.getElementById("sign-in-btn");
const createAccountButtonEl = document.getElementById("create-account-btn");

const userProfilePictureEl = document.getElementById("user-profile-picture");
const userGreetingEl = document.getElementById("user-greeting");

const displayNameInputEl = document.getElementById("display-name-input");
const photoURLInputEl = document.getElementById("photo-url-input");
// const updateProfileButtonEl = document.getElementById("update-profile-btn");

const textareaEl = document.getElementById("post-input");
const postButtonEl = document.getElementById("post-btn");

/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle);

signInButtonEl.addEventListener("click", authSignInWithEmail);
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail);
const signOutButtonEl = document.getElementById("sign-out-btn");
signOutButtonEl.addEventListener("click", authSignOut);
// updateProfileButtonEl.addEventListener("click", authUpdateProfile);
postButtonEl.addEventListener("click", postButtonPressed);

/* === Main Code === */

showLoggedOutView();

/* === Functions === */
function postButtonPressed() {
  const postBody = textareaEl.value;

  if (postBody) {
    addPostToDB(postBody);
    clearInputField(textareaEl);
  }
}

/* = Functions - Firebase - Cloud Firestore = */

async function addPostToDB(postBody) {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      body: postBody,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error(error.message);
  }
}

/* = Functions - Firebase - Authentication = */

onAuthStateChanged(auth, (user) => {
  if (user) {
    showLoggedInView();
    showProfilePicture(userProfilePictureEl, user);
    showUserGreeting(userGreetingEl, user);
  } else {
    showLoggedOutView();
  }
});

function authSignInWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("Signed in succesful");
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function authSignInWithEmail() {
  const email = emailInputEl.value;
  const password = passwordInputEl.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      clearAuthFields();
      // ...
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function authCreateAccountWithEmail() {
  const email = emailInputEl.value;
  const password = passwordInputEl.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      clearAuthFields();
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function authSignOut() {
  signOut(auth)
    .then(() => {})
    .catch((error) => {
      console.error(error.message);
    });
}

/* == Functions - UI Functions == */

function showLoggedOutView() {
  hideView(viewLoggedIn);
  showView(viewLoggedOut);
}

function showLoggedInView() {
  hideView(viewLoggedOut);
  showView(viewLoggedIn);
}

function showView(view) {
  view.style.display = "flex";
}

function hideView(view) {
  view.style.display = "none";
}

function clearInputField(field) {
  field.value = "";
}

function clearAuthFields() {
  clearInputField(emailInputEl);
  clearInputField(passwordInputEl);
}

function showProfilePicture(imgElement, user) {
  const photoURL = user.photoURL;

  if (photoURL) {
    imgElement.src = photoURL;
  } else {
    imgElement.src = "src/assets/images/profile-img.avif";
  }
}

function showUserGreeting(element, user) {
  const displayName = user.displayName;
  if (displayName) {
    const userFirstName = displayName.split(" ")[0];

    element.textContent = `Hey ${userFirstName}, how are you?`;
  } else {
    element.textContent = `Hey friend, how are you?`;
  }
}

// function authUpdateProfile() {
//   const newDisplayName = displayNameInputEl.value;
//   const newPhotoURL = photoURLInputEl.value;

//   updateProfile(auth.currentUser, {
//     displayName: newDisplayName,
//     photoURL: newPhotoURL,
//   })
//     .then(() => {
//       console.log("Profile updated");
//     })
//     .catch((error) => {
//       console.error(error.message);
//     });
// }
