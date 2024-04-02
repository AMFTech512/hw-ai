<template>
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
    <label for="answer">Answer</label>
    <br />
    <textarea id="answer" v-model="answer" />
    <br />
    <button @click="submitHandler" :disabled="isSubmitting">Submit</button>
  </div>
  <div v-else>
    <p>Problem not found</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useProblem } from "../lib/problem-repo";
import { useSubmissionRepo } from "../lib/submission-repo";
import { useRouter } from "vue-router";

const { problem, doesProblemExist } = await useProblem();
const { submissionRepo } = useSubmissionRepo();
const router = useRouter();

// TODO: account for problem being null
const existingSubmission = await submissionRepo.getSubmission(problem!.id);

if (existingSubmission) {
  // Redirect to the submission view page
  router.replace(
    `/problems/${problem!.id}/submissions/${existingSubmission.id}`
  );
}

const answer = ref("");

const isSubmitting = ref(false);
const submitHandler = async () => {
  if (!problem) {
    return;
  }

  isSubmitting.value = true;

  // Submit the answer to the problem
  const submissionId = await submissionRepo.submit(problem.id, {
    input: {
      answer: answer.value,
    },
  });

  isSubmitting.value = false;
  router.replace(`/problems/${problem!.id}/submissions/${submissionId}`);
};
</script>
