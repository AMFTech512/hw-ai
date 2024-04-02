<template>
  <h1>Submission</h1>
  <div v-if="submissionState === 'loading'">
    <img src="../assets/loading-spinner.svg" width="20" /> Loading...
  </div>
  <div v-else-if="submissionState === 'submitted'">
    <img src="../assets/loading-spinner.svg" width="20" /> Queued for grading...
  </div>
  <div v-else-if="submissionState === 'processing'">
    <img src="../assets/loading-spinner.svg" width="20" /> Grading...
  </div>
  <div v-else-if="submissionState === 'graded'">
    <p>
      Score: {{ submission?.result?.score }} /
      {{ submission?.result?.criteria.length }}
    </p>
    <div>
      <strong>Feedback</strong>
      <div v-for="criterion in submission?.result?.criteria">
        <p>
          {{ criterion.isSatisfactory ? "✅" : "❌" }} Criterion:
          {{ criterion.criterion }}
        </p>
        <p>{{ criterion.reasoning }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SubmissionDoc, useSubmissionRepo } from "../lib/submission-repo";
import { useRoute } from "vue-router";

const route = useRoute();
const problemId = route.params.problemId as string;
const submissionId = route.params.submissionId as string;

const submissionState = ref<"loading" | "submitted" | "processing" | "graded">(
  "loading"
);

const submission = ref<SubmissionDoc>();

const { submissionRepo } = useSubmissionRepo();

submissionRepo.subscribeToSubmission(problemId, submissionId, (newDoc) => {
  // TODO: handle the case where the submission is not found
  if (!newDoc) {
    return;
  }

  submission.value = newDoc;
  submissionState.value = newDoc.status;
});
</script>
