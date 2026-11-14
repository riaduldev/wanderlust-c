"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-24 text-center animate-rise-in sm:px-6">
      <span className="bg-destructive/10 text-destructive flex size-14 items-center justify-center rounded-full">
        <AlertTriangle className="size-6" />
      </span>

      <h1 className="font-heading mt-6 text-3xl font-semibold sm:text-4xl">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mt-3 max-w-xl text-sm sm:text-base">
        An unexpected error occurred while loading this page. It may be
        temporary — try again, or head back to the homepage.
      </p>

      {error.digest ? (
        <p className="text-muted-foreground/70 mt-3 font-mono text-xs">
          Error ID: {error.digest}
        </p>
      ) : null}

      <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
        <Button
          onClick={reset}
          className="bg-brand hover:bg-brand-dark text-white w-full sm:w-auto"
        >
          <RotateCcw />
          Try again
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          className="w-full sm:w-auto"
          render={<Link href="/">Back to home</Link>}
        />
      </div>
    </section>
  );
}
