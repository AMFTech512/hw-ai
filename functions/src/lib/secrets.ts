import { defineSecret } from "firebase-functions/params";

export const OPENAI_API_KEY_SECRET = defineSecret("OPENAI_API_KEY");
