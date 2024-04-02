import { inject } from "vue";
import { FIREBASE_USER } from "./di";
import { User } from "firebase/auth";

export function useUser() {
  return inject(FIREBASE_USER) as User;
}
