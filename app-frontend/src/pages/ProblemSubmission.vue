<template>
  <h1>Problem Submission</h1>
  <div v-if="doesProblemExist">
    <p>
      <strong>Refer to the following passage to answer the question.</strong>
    </p>
    <p>
      <quote>{{ problem?.params?.passage }}</quote>
    </p>
    <p>
      <strong>{{ problem?.params?.question }}</strong>
    </p>
    <button @click="submitHandler" :disabled="isSubmitting">Submit</button>
  </div>
  <div v-else>
    <p>Problem not found</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useProblem } from "../lib/problem-repo";

const { problem, doesProblemExist } = await useProblem();

const isSubmitting = ref(false);
const submitHandler = async () => {
  if (!problem) {
    return;
  }

  isSubmitting.value = true;

  // Submit the answer to the problem

  isSubmitting.value = false;
};
</script>
