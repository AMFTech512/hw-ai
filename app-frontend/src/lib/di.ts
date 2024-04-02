import { FirebaseApp } from "firebase/app";
import { User } from "firebase/auth";
import { InjectionKey } from "vue";

export const FIREBASE_APP = Symbol("FIREBASE_APP") as InjectionKey<FirebaseApp>;
export const FIREBASE_USER = Symbol("FIREBASE_USER") as InjectionKey<User>;
