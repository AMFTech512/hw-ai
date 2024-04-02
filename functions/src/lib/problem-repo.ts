import { Firestore } from "firebase-admin/firestore";
import { DIContainer } from "./di";

export interface ProblemDoc {
  params: {
    passage: string;
    question: string;
    criteria: string[];
  };
}

export const PROBLEMS_COLLECTION = "problems";

export class ProblemRepo {
  private _firestore: Firestore;

  constructor(container: DIContainer) {
    this._firestore = container.firestore;
  }

  async getProblem(id: string) {
    const doc = await this._firestore
      .collection(PROBLEMS_COLLECTION)
      .doc(id)
      .get();
    return doc.data() as ProblemDoc | undefined;
  }

  async upsertProblem(doc: Partial<ProblemDoc>, id?: string) {
    if (id) {
      await this._firestore.collection(PROBLEMS_COLLECTION).doc(id).update(doc);
      return id;
    } else {
      const ref = await this._firestore
        .collection(PROBLEMS_COLLECTION)
        .add(doc);
      return ref.id;
    }
  }
}
