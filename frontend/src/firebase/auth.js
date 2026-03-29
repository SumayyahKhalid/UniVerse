import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Check if email is a valid Laurier email
const isLaurierEmail = (email) => {
  return email.endsWith("@mylaurier.ca");
};

// Sign up a new user
export const signUp = async (email, password) => {
  if (!isLaurierEmail(email)) {
    throw new Error("You must use a Laurier email (@mylaurier.ca) to sign up.");
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Save the user's email in Firestore database
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    createdAt: new Date().toISOString()
  });

  return user;
};

// Log in an existing user
export const logIn = async (email, password) => {
  if (!isLaurierEmail(email)) {
    throw new Error("You must use a Laurier email (@mylaurier.ca) to log in.");
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Log out
export const logOut = async () => {
  await signOut(auth);
};