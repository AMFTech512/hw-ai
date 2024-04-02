import {
  DocumentReference,
  Firestore,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { DIContainer } from "./di";
import { ComprehensionQuestionGradeResponse } from "./ai";
import { PROBLEMS_COLLECTION } from "./problem-repo";

export const SUBMISSIONS_COLLECTION = "submissions";

export interface SubmissionDoc {
  status: "submitted" | "processing" | "graded";
  input: {
    answer: string;
  };
  result?: ComprehensionQuestionGradeResponse & { score: number };
}

export class SubmissionRepo {
  private _firestore: Firestore;

  constructor(container: DIContainer) {
    this._firestore = container.firestore;
  }

  /**
   * Returns a tuple of the problemId and submissionId for a submission doc ref.
   *
   * @param ref - The reference to a submission doc.
   */
  static getIds(ref: DocumentReference) {
    return [ref.parent.parent?.id!, ref.id] as const;
  }

  async getSubmission(
    submissionSnapshot: QueryDocumentSnapshot
  ): Promise<SubmissionDoc>;
  async getSubmission(
    problemId: string,
    submissionId: string
  ): Promise<SubmissionDoc>;
  async getSubmission(
    snapshotOrProblemId: string | QueryDocumentSnapshot,
    submissionId?: string
  ) {
    if (typeof snapshotOrProblemId === "string" && submissionId) {
      const doc = await this._firestore
        .collection(PROBLEMS_COLLECTION)
        .doc(snapshotOrProblemId)
        .collection(SUBMISSIONS_COLLECTION)
        .doc(submissionId)
        .get();
      return doc.data() as SubmissionDoc | undefined;
    } else if (snapshotOrProblemId instanceof QueryDocumentSnapshot) {
      return snapshotOrProblemId.data() as SubmissionDoc;
    }

    throw new Error("Invalid arguments");
  }

  async upsertSubmission(
    doc: Partial<SubmissionDoc>,
    problemId: string,
    submissionId?: string
  ) {
    // if we're adding a new submission, we don't need to specify the submissionId
    if (!submissionId) {
      const ref = await this._firestore
        .collection(PROBLEMS_COLLECTION)
        .doc(problemId)
        .collection(SUBMISSIONS_COLLECTION)
        .add(doc);
      return ref.id;
    }
    // otherwise, we're updating an existing submission
    else {
      await this._firestore
        .collection(PROBLEMS_COLLECTION)
        .doc(problemId)
        .collection(SUBMISSIONS_COLLECTION)
        .doc(submissionId)
        .update(doc);
      return submissionId;
    }
  }
}
