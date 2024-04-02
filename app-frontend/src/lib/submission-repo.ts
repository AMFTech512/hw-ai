import { FirebaseApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { PROBLEMS_COLLECTION } from "./problem-repo";
import { useFirebase } from "./firebase";

export interface ComprehensionQuestionGradeResponse {
  criteria: {
    criterion: string;
    reasoning: string;
    isSatisfactory: boolean;
  }[];
}

export interface SubmissionDoc {
  id: string;
  uid: string;
  status: "submitted" | "processing" | "graded";
  input: {
    answer: string;
  };
  result?: ComprehensionQuestionGradeResponse & { score: number };
}

export const SUBMISSIONS_COLLECTION = "submissions";

export class SubmissionRepo {
  private _firestore: Firestore;
  private _auth: Auth;

  constructor(firebaseApp: FirebaseApp) {
    this._firestore = getFirestore(firebaseApp);
    this._auth = getAuth(firebaseApp);
  }

  subscribeToSubmission(
    problemId: string,
    submissionId: string,
    callback: (submission: SubmissionDoc | null) => void
  ) {
    const unsubscribe = onSnapshot(
      doc(
        this._firestore,
        PROBLEMS_COLLECTION,
        problemId,
        SUBMISSIONS_COLLECTION,
        submissionId
      ),
      (snapshot) => {
        // if the submission does not exist, return null
        if (!snapshot.exists) {
          callback(null);
        }
        // return the submission data
        else {
          callback({
            id: snapshot.id,
            ...snapshot.data(),
          } as SubmissionDoc);
        }
      }
    );
    return unsubscribe;
  }

  async getSubmission(problemId: string) {
    // get the submission document based on problem id and user id
    const q = query(
      collection(
        this._firestore,
        PROBLEMS_COLLECTION,
        problemId,
        SUBMISSIONS_COLLECTION
      ),
      where("uid", "==", this._auth.currentUser?.uid)
    );

    const querySnapshot = await getDocs(q);

    // if the submission does not exist, return null
    if (querySnapshot.docs.length === 0) {
      return null;
    }

    // return the submission data
    return {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data(),
    } as SubmissionDoc;
  }

  async submit(problemId: string, submission: Partial<SubmissionDoc>) {
    // add the submission to Firestore
    const docRef = await addDoc(
      collection(
        this._firestore,
        PROBLEMS_COLLECTION,
        problemId,
        SUBMISSIONS_COLLECTION
      ),
      {
        ...submission,
        uid: this._auth.currentUser?.uid,
        status: "submitted",
      }
    );

    return docRef.id;
  }
}

export function useSubmissionRepo() {
  const firebaseApp = useFirebase();
  const submissionRepo = new SubmissionRepo(firebaseApp);

  return { submissionRepo };
}
