<template>
  <div>
    <h1>Problems</h1>
    <ul>
      <li v-for="problem in problems" :key="problem.id">
        <RouterLink :to="`/problems/${problem.id}/edit`">
          {{ problem.params?.question || "New Question" }}
        </RouterLink>
      </li>
    </ul>
    <button @click="createProblemHandler" :disabled="isCreatingProblem">
      + Create Problem
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUser } from "../lib/auth.ts";
import { useFirebase } from "../lib/firebase.ts";
import { ProblemRepo } from "../lib/problem-repo.ts";
import { ref } from "vue";

const router = useRouter();

const firebaseApp = useFirebase();
const user = useUser();
const problemRepo = new ProblemRepo(firebaseApp);

const problems = await problemRepo.getProblems(user.uid);

const isCreatingProblem = ref(false);
const createProblemHandler = async () => {
  isCreatingProblem.value = true;
  const newProblemRef = await problemRepo.createProblemRef();

  router.push(`/problems/${newProblemRef.id}/edit`);
  isCreatingProblem.value = false;
};
</script>
