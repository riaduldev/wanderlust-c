import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// Guard the scheme: `new MongoClient("http://...")` throws MongoParseError at
// module evaluation (which runs at build time on Vercel). A non-mongo or
// missing value falls back to a valid scheme so the build never crashes —
// auth simply fails at request time until the real URI is configured.
const authUri = process.env.BETTER_AUTH_DB_URI ?? "";
const authClient = new MongoClient(
  authUri.startsWith("mongodb://") || authUri.startsWith("mongodb+srv://")
    ? authUri
    : "mongodb://localhost:27017",
);
const authDb = authClient.db("wanderlust");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_DB_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_DB_SECRET as string,
    },
  },
  plugins: [nextCookies()],
  database: mongodbAdapter(authDb, {
    client: authClient,
  }),
});
