import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { DIContainer } from "./di";
import { AI } from "./ai";
import { SubmissionRepo } from "./submission-repo";
import * as logger from "firebase-functions/logger";

export type OnDocumentCreatedHandler = Parameters<typeof onDocumentCreated>[1];
export type OnDocumentCreatedHandlerFactory = (
  container: DIContainer
) => OnDocumentCreatedHandler;

export const submissionCreatedHandler: OnDocumentCreatedHandlerFactory =
  (container) => async (event) => {
    const submissionSnapshot = event.data;
    if (!submissionSnapshot) return;

    // get the submission and problem ids
    const [problemId, submissionId] = SubmissionRepo.getIds(
      submissionSnapshot.ref
    );

    // set the status of the problem to processing
    await container.submissionRepo?.upsertSubmission(
      {
        status: "processing",
      },
      problemId,
      submissionId
    );

    // get the original problem
    const problemDoc = await container.problemRepo.getProblem(problemId);
    if (!problemDoc) {
      logger.error("Problem not found", { problemId, submissionId });
      return;
    }

    // get the submission
    const submissionDoc = await container.submissionRepo.getSubmission(
      submissionSnapshot
    );

    // grade the problem with AI
    const { params } = problemDoc;
    const res = await container.ai.gradeResponse(
      AI.generateGradeQuery(
        params.passage,
        params.question,
        params.criteria,
        submissionDoc.input.answer
      )
    );

    // save the result
    await container.submissionRepo?.upsertSubmission(
      { status: "graded", result: res },
      problemId,
      submissionId
    );
  };
