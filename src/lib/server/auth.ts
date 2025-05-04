import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { feedback } from "@better-auth-kit/feedback";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  plugins: [feedback({minLength: 1})],

  user: {
    additionalFields: {
      isPro: {
        type: "boolean",
        default: false,
      },
      customerId: {
        type: "string",
      },
      proStartDate: {
        type: "date",
      },
      proEndDate: {
        type: "date",
      },
      credits: {
        type: "number",
        nullable: false,
        default: 0,
      },
    },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      mapProfileToUser: (profile) => {
        return {
          image: profile.picture,
        };
      },
    },
  },
});

type Session = typeof auth.$Infer.Session;
