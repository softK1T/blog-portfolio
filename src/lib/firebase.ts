import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase configuration object containing all necessary credentials and settings.
 * These values are loaded from environment variables for security.
 * 
 * @see https://firebase.google.com/docs/web/setup#config-object
 */
const firebaseConfig = {
  /** Firebase API key for web authentication */
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  /** Firebase auth domain for authentication */
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  /** Firebase project ID */
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  /** Firebase storage bucket for file uploads */
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  /** Firebase messaging sender ID for notifications */
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  /** Firebase app ID */
  appId: process.env.NEXT_PUBLIC_APP_ID,
  /** Firebase measurement ID for analytics */
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID,
};

// Validate that essential Firebase configuration is present
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    "Firebase configuration is missing. Please check your environment variables."
  );
}

/**
 * Firebase app instance initialized with the configuration.
 * This is the root Firebase instance for the application.
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication instance.
 * Used for user authentication, sign-in, sign-out, and user state management.
 * 
 * @example
 * ```ts
 * import { signInWithEmailAndPassword } from "firebase/auth";
 * import { auth } from "@/lib/firebase";
 * 
 * const signIn = async (email: string, password: string) => {
 *   return await signInWithEmailAndPassword(auth, email, password);
 * };
 * ```
 */
export const auth = getAuth(app);

/**
 * Firebase Firestore database instance.
 * Used for storing and retrieving portfolio projects, blog posts, and development logs.
 * 
 * @example
 * ```ts
 * import { collection, getDocs } from "firebase/firestore";
 * import { db } from "@/lib/firebase";
 * 
 * const getProjects = async () => {
 *   const querySnapshot = await getDocs(collection(db, "portfolio"));
 *   return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
 * };
 * ```
 */
export const db = getFirestore(app);
