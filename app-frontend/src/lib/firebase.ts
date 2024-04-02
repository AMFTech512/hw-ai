import { FirebaseApp, initializeApp } from "firebase/app";
import { FIREBASE_APP } from "./di";
import { inject, provide } from "vue";

const firebaseConfig = {
  apiKey: "AIzaSyCDe4NlhwvTNI2cSiqDq6TKdlybGqRKwKY",
  authDomain: "hw-ai-c9f5c.firebaseapp.com",
  projectId: "hw-ai-c9f5c",
  storageBucket: "hw-ai-c9f5c.appspot.com",
  messagingSenderId: "380570983761",
  appId: "1:380570983761:web:1ecdf5e47d627dffad0770",
};

/**
 * Initialize Firebase and inject it into the app
 */
export function useInitFirebase() {
  const app = initializeApp(firebaseConfig);
  provide(FIREBASE_APP, app);

  return app;
}

/**
 * Get the Firebase app instance. It must be called after `useInitFirebase`.
 */
export function useFirebase() {
  return inject(FIREBASE_APP) as FirebaseApp;
}
