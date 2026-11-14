import { BookingsList } from "@/components/bookings-list";

export default function BookingsPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10 animate-rise-in sm:px-6">
      <header className="mb-6">
        <h1 className="font-heading text-3xl font-semibold">My Bookings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage and view your upcoming travel plans
        </p>
      </header>

      <BookingsList />
    </section>
  );
}
