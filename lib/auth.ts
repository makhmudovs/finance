import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index"; // your drizzle instance

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  // session: {
  //   expiresIn: 300, // 🔴 5 minutes = actual logout
  //   updateAge: 0, // optional: prevent refresh
  //   disableSessionRefresh: true,
  //   cookieCache: {
  //     enabled: true,
  //     maxAge: 300,
  //   },
  // },
});
