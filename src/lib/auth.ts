import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(
  process.env.BETTER_AUTH_DB_URI ?? "http://localhost:3000",
);
const db = client.db("wanderlust-db");

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
  database: mongodbAdapter(db, {
    client,
  }),
});