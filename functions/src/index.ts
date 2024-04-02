/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import { onRequest } from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
// import { helloWorldHandler } from "./lib/handlers";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { OPENAI_API_KEY_SECRET } from "./lib/secrets";
import { dIDocumentCreatedMiddleware } from "./lib/middleware";
import { submissionCreatedHandler } from "./lib/handlers";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const processSubmission = onDocumentCreated(
  {
    document: "problems/{problemId}/submissions/{submissionId}",
    secrets: [OPENAI_API_KEY_SECRET],
  },
  dIDocumentCreatedMiddleware(submissionCreatedHandler)
);
