import { getAuth, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseApp } from './firebase.config';

export const auth = getAuth(firebaseApp);

export const logout = () => signOut(auth);

const provider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, provider);