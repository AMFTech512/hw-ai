<template>
  <slot />
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
import { provide } from "vue";
import { FIREBASE_USER } from "../lib/di";

const firebaseApp = useFirebase();
const MINIMUM_DELAY = 500;

// get the current auth state
const firebaseAuth = getAuth(firebaseApp);
const user: User = await withMinimumDelay(
  new Promise((resolve) => {
    const unsub = onAuthStateChanged(firebaseAuth, async (user) => {
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

      unsub();
    });
  }),
  MINIMUM_DELAY
);

// provide the user for the app
provide(FIREBASE_USER, user);
</script>
