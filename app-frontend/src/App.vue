<template>
  <Suspense>
    <Auth />

    <template #fallback>
      <img src="./assets/loading-spinner.svg" width="50" />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { useInitFirebase } from "./lib/firebase";
import Auth from "./components/Auth.vue";

// Initialize Firebase and inject it into the app
useInitFirebase();
</script>

<style scoped></style>
