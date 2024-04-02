import { FirebaseApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import {
  Firestore,
  getFirestore,
  getDocs,
  query,
  collection,
  where,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { useFirebase } from "./firebase";
import { useRoute } from "vue-router";

export const PROBLEMS_COLLECTION = "problems";

export interface ProblemDoc {
  id: string;
  params?: {
    passage?: string;
    question?: string;
    criteria?: string[];
  };
}

export class ProblemRepo {
  private _firestore: Firestore;
  private _auth: Auth;

  constructor(app: FirebaseApp) {
    this._firestore = getFirestore(app);
    this._auth = getAuth(app);
  }

  /**
   * Gets all problems created by a user
   * @param uid
   * @returns
   */
  async getProblems(uid: string) {
    // Get problems from Firestore
    const q = query(
      collection(this._firestore, PROBLEMS_COLLECTION),
      where("creatorUID", "==", uid)
    );
    const querySnapshot = await getDocs(q);

    // return the problem data
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as ProblemDoc)
    );
  }

  /**
   * Gets a problem by its ID
   * @param id
   * @returns
   */
  async getProblem(id: string) {
    // Get problem from Firestore
    const problemDoc = await getDoc(
      doc(this._firestore, PROBLEMS_COLLECTION, id)
    );

    // If the problem does not exist, return null
    if (!problemDoc.exists()) {
      return null;
    }

    // return the problem data
    return { id: problemDoc.id, ...problemDoc.data() } as ProblemDoc;
  }

  /**
   * Creates a problem ref
   */
  async createProblemRef(
    data: Partial<ProblemDoc> = {
      params: {
        passage: "",
        question: "",
        criteria: [],
      },
    }
  ) {
    return await addDoc(collection(this._firestore, PROBLEMS_COLLECTION), {
      creatorUID: this._auth.currentUser?.uid,
      ...data,
    });
  }

  /**
   * Updates a problem
   * @param id
   * @param data
   */
  async updateProblem(id: string, data: Partial<ProblemDoc>) {
    return await updateDoc(doc(this._firestore, PROBLEMS_COLLECTION, id), {
      creatorUID: this._auth.currentUser?.uid,
      ...data,
    });
  }

  /**
   * Deletes a problem
   */
  async deleteProblem(id: string) {
    // Delete the problem from Firestore
    return await deleteDoc(doc(this._firestore, PROBLEMS_COLLECTION, id));
  }
}

export async function useProblem() {
  const route = useRoute();
  // first fetch the problem from the database
  const firebaseApp = useFirebase();
  const problemRepo = new ProblemRepo(firebaseApp);
  // TODO: account for when this is not a string?
  const problemId = route.params.id as string;
  const problem = await problemRepo.getProblem(problemId);

  const doesProblemExist = !!problem;

  const updateProblem = async (data: Partial<ProblemDoc>) => {
    if (problem) {
      await problemRepo.updateProblem(problem.id, data);
    }
  };

  const deleteProblem = async () => {
    if (problem) {
      await problemRepo.deleteProblem(problem.id);
    }
  };

  return {
    problem,
    doesProblemExist,
    updateProblem,
    deleteProblem,
  };
}
