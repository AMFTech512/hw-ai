<template>
  <h1>Edit Problem</h1>
  <RouterLink to="/problems">Back to Problems</RouterLink>
  <br />
  <RouterLink :to="`/problems/${problem?.id}/submit`"
    >Answer Problem</RouterLink
  >
  <div v-if="doesProblemExist">
    <label for="question">Question</label>
    <br />
    <input id="question" type="text" v-model="question" />
    <br />
    <label for="passage">Passage</label>
    <br />
    <textarea id="passage" v-model="passage" />
    <br />
    <label for="criteria">Criteria</label>
    <br />
    <ul>
      <li v-for="(_, index) in criteria" :key="index">
        <input type="text" v-model="criteria[index]" />
      </li>
    </ul>
    <button @click="criteria.push('')">+ Add Criterion</button>
    <button @click="saveHandler" :disabled="isSaving">Save</button>
    <button @click="deleteHandler" :disabled="isSaving">Delete</button>
  </div>
  <div v-else>
    <p>Problem not found</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useProblem } from "../lib/problem-repo";

const router = useRouter();
const { problem, updateProblem, deleteProblem, doesProblemExist } =
  await useProblem();

const question = ref(problem?.params?.question ?? "");
const passage = ref(problem?.params?.passage ?? "");
const criteria = ref(problem?.params?.criteria ?? []);

const isSaving = ref(false);
const saveHandler = async () => {
  if (!problem) {
    return;
  }

  isSaving.value = true;

  await updateProblem({
    params: {
      question: question.value,
      passage: passage.value,
      criteria: criteria.value,
    },
  });

  isSaving.value = false;
};

const deleteHandler = async () => {
  if (!problem) {
    return;
  }

  isSaving.value = true;

  await deleteProblem();

  isSaving.value = false;
  router.replace("/problems");
};
</script>
