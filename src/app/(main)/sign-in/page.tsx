"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, Mail } from "lucide-react";

import { signIn } from "@/app/api/auth/[...all]/auth-client";
import { GoogleIcon } from "@/components/auth/google-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

const fieldIconClass =
  "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70";

/** Path the proxy sent us back from (`?next=/destinations/...`) — must stay a same-site path. */
function safeNextPath() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : null;
}

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    try {
      const { data, error } = await signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        toast.add({
          type: "error",
          title: "Could not sign you in",
          description: error.message ?? "Check your email and password.",
        });
        return;
      }

      toast.add({
        type: "success",
        title: `Welcome back${data?.user?.name ? `, ${data.user.name}` : ""}!`,
        description: "You are signed in.",
      });
      router.replace(safeNextPath() ?? "/");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  function handleGoogleSignIn() {
    void signIn.social({
      provider: "google",
      callbackURL: safeNextPath() ?? "/profile",
    });
  }

  return (
    <div className="flex w-full flex-1 items-center justify-center bg-muted/50 px-4 py-12">
      <div className="animate-rise-in flex w-full max-w-sm flex-col items-center">
        <h1 className="font-heading text-3xl font-semibold text-foreground">
          Welcome Back
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resume your adventure with Wanderlast
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 w-full rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className={fieldIconClass} aria-hidden="true" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="h-9 rounded-md bg-muted/60 pl-9 placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className={fieldIconClass} aria-hidden="true" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="h-9 rounded-md bg-muted/60 pl-9 placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="size-4 accent-brand"
                />
                Remember me
              </label>
              <Link
                href="#"
                className="text-sm text-brand hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={pending}
              className="mt-1 w-full rounded-md bg-brand text-white hover:bg-brand-dark"
            >
              {pending ? "Signing in…" : "Sign In"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Or continue with
            </p>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleGoogleSignIn}
              className="w-full rounded-md"
            >
              <GoogleIcon />
              Sign In With Google
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-brand hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
