"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, Mail, User } from "lucide-react";

import { signIn, signUp } from "@/app/api/auth/[...all]/auth-client";
import { GoogleIcon } from "@/components/auth/google-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

const fieldIconClass =
  "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    if (password.length < 8) {
      toast.add({
        type: "error",
        title: "Password too short",
        description: "Use at least 8 characters for your password.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.add({
        type: "error",
        title: "Passwords do not match",
        description: "Make sure both password fields are identical.",
      });
      return;
    }

    setPending(true);
    try {
      const { error } = await signUp.email({
        name: fullName,
        email,
        password,
      });

      if (error) {
        toast.add({
          type: "error",
          title: "Could not create your account",
          description: error.message ?? "Please try again.",
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Account created",
        description: "Welcome to Wanderlast!",
      });
      router.replace("/");
    } finally {
      setPending(false);
    }
  }

  async function handleGoogleSignUp() {
  const { error } = await signIn.social({
    provider: "google",
    callbackURL: "/",
  });

  if (error) {
    console.error("Google sign-up failed:", error.message);
  }
  
}

  return (
    <div className="flex w-full flex-1 items-center justify-center bg-muted/50 px-4 py-12">
      <div className="animate-rise-in flex w-full max-w-sm flex-col items-center">
        <h1 className="font-heading text-3xl text-foreground">Create Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Start your adventure with Wanderlast
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 w-full rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="full-name">Full Name</Label>
              <div className="relative">
                <User className={fieldIconClass} aria-hidden="true" />
                <Input
                  id="full-name"
                  name="name"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter your name"
                  className="h-9 rounded-md bg-muted/60 pl-9 placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  className="h-9 rounded-md bg-muted/60 pl-9 placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Lock className={fieldIconClass} aria-hidden="true" />
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm your password"
                  className="h-9 rounded-md bg-muted/60 pl-9 placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={pending}
              className="mt-1 w-full rounded-md bg-brand text-white hover:bg-brand-dark"
            >
              {pending ? "Creating account…" : "Create Account"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Or sign up with
            </p>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleGoogleSignUp}
              className="w-full rounded-md"
            >
              <GoogleIcon />
              Sign Up With Google
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-brand hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
