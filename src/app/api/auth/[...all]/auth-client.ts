import { createAuthClient } from "better-auth/react"

// One shared client instance: `useSession` (Navbar, MobileNav, Profile) and
// the mutation helpers (`signOut`, `updateUser`) must share a single session
// cache, otherwise signing out or renaming leaves the navbar/profile on a
// stale session. Same-origin app, so the explicit baseURL is optional — it
// only matters for SSR, where better-auth also falls back to BETTER_AUTH_URL.
export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
})

export const { signIn, signUp, useSession, signOut } = authClient
