import type { ReactNode } from "react";

export function InfoPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-12 animate-rise-in sm:px-6">
      <h1 className="font-heading text-3xl font-semibold">{title}</h1>
      <p className="text-muted-foreground mt-2 text-sm">{intro}</p>

      <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export function InfoSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-heading text-lg font-semibold">{heading}</h2>
      <div className="text-muted-foreground mt-2">{children}</div>
    </section>
  );
}
