import { feedbackClient } from "@better-auth-kit/feedback";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL as string,
  plugins: [feedbackClient()],
});

export type Session = typeof authClient.$Infer.Session;
