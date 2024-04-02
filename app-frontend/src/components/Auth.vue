<template>
  <div>
    <h1>Auth</h1>
    <p>User: {{ user.uid }}</p>
  </div>
</template>

<script setup lang="ts">
import { useFirebase } from "../lib/firebase";
import {
  User,
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";
import { withMinimumDelay } from "../lib/util";
import { inject } from "vue";
import { FIREBASE_USER } from "../lib/di";

const firebaseApp = useFirebase();
const MINIMUM_DELAY = 1000;

// get the current auth state
const firebaseAuth = getAuth(firebaseApp);
const user: User = await withMinimumDelay(
  new Promise((resolve) => {
    onAuthStateChanged(firebaseAuth, async (user) => {
      // if the user is not logged in, log them in anonymously
      if (!user) {
        await signInAnonymously(firebaseAuth).then((userCred) =>
          resolve(userCred.user)
        );
      }
      // if the user is logged in, resolve the user
      else {
        resolve(user);
      }
    });
  }),
  MINIMUM_DELAY
);

// inject the user into the app
inject(FIREBASE_USER, user);
</script>
