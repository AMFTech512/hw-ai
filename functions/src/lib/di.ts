import { App } from "firebase-admin/app";
import { Config } from "./config";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import { Request } from "firebase-functions/v2/https";
import { NextFunction, Response } from "express";
import OpenAI from "openai";
import { AI } from "./ai";
import { OPENAI_API_KEY_SECRET } from "./secrets";
import * as admin from "firebase-admin";
import { ProblemRepo } from "./problem-repo";
import { SubmissionRepo } from "./submission-repo";

export interface DIContainer {
  config: Config;
  firebaseApp: App;
  firestore: Firestore;
  openAIClient: OpenAI;
  ai: AI;
  problemRepo: ProblemRepo;
  submissionRepo: SubmissionRepo;
}

export type DIRequest = Request & { container: DIContainer };
export type DIHandler = (
  req: DIRequest,
  res: Response,
  next: NextFunction
) => void;

export function createDIContainer(
  container: Partial<DIContainer> = {}
): DIContainer {
  return container as DIContainer;
}

const firebaseApp = admin.initializeApp();
export function initContainer() {
  // initialize dependencies
  const openAIKey = OPENAI_API_KEY_SECRET.value();
  const openAIClient = new OpenAI({
    apiKey: openAIKey,
  });

  const container = createDIContainer({
    firebaseApp,
    firestore: getFirestore(firebaseApp),
    config: {
      openAIKey,
    },
    openAIClient,
  });

  container.ai = new AI(container);
  container.problemRepo = new ProblemRepo(container);
  container.submissionRepo = new SubmissionRepo(container);

  return container;
}
