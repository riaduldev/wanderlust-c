"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Camera,
  CircleDollarSign,
  Globe,
  LogOut,
  Mail,
  Pencil,
  Plane,
  TrendingUp,
} from "lucide-react";

import { authClient, useSession } from "@/app/api/auth/[...all]/auth-client";
import { useBookings } from "@/hooks/use-bookings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";

function StatCard({
  label,
  value,
  icon,
  iconClassName,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconClassName: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {value}
          </p>
        </div>
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "W";
  }
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { bookings } = useBookings();
  const user = session?.user;

  const [imageError, setImageError] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);

  const stats = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const countries = new Set(bookings.map((booking) => booking.country));
    const upcoming = bookings.filter((booking) => {
      const time = new Date(booking.departureDate).getTime();
      return Number.isFinite(time) && time >= startOfToday.getTime();
    });
    const totalSpent = bookings.reduce(
      (sum, booking) => sum + (Number.isFinite(booking.price) ? booking.price : 0),
      0,
    );

    return {
      totalBookings: bookings.length,
      countriesVisited: countries.size,
      upcomingTrips: upcoming.length,
      totalSpent,
    };
  }, [bookings]);

  const totalSpentLabel = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(stats.totalSpent);

  function handleEditOpenChange(open: boolean) {
    setEditOpen(open);
    if (open) {
      setNameInput(user?.name ?? "");
    }
  }

  async function handleSaveName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    const name = nameInput.trim();
    if (!name) {
      toast.add({
        type: "error",
        title: "Name can't be empty",
        description: "Enter a display name to save.",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await authClient.updateUser({ name });

      if (error) {
        toast.add({
          type: "error",
          title: "Could not update your profile",
          description: error.message ?? "Please try again.",
        });
        return;
      }

      toast.add({ type: "success", title: "Profile updated" });
      setEditOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await authClient.signOut();
    toast.add({ type: "success", title: "Signed out" });
    router.replace("/sign-in");
  }

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="mt-2 h-4 w-72" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <Skeleton className="h-80 rounded-xl" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex w-full flex-1 items-center justify-center bg-muted/50 px-4 py-12">
        <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <h1 className="font-heading text-2xl text-foreground">
            You&apos;re not signed in
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to view your profile and travel statistics.
          </p>
          <Button
            render={<Link href="/sign-in" />}
            nativeButton={false}
            className="mt-5 w-full rounded-md bg-brand text-white hover:bg-brand-dark"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
      <div className="animate-rise-in">
        <h1 className="font-heading text-3xl text-foreground">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings and travel preferences
        </p>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[280px_1fr]">
        <div className="animate-rise-in rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {user.image && !imageError ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={96}
                  height={96}
                  onError={() => setImageError(true)}
                  className="size-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-24 items-center justify-center rounded-full bg-brand/15 font-heading text-2xl text-brand">
                  {initialsOf(user.name ?? "Wanderlast")}
                </div>
              )}
              <span
                aria-hidden="true"
                className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full bg-brand ring-2 ring-card"
              >
                <Camera className="size-3.5 text-white" />
              </span>
            </div>

            <p className="mt-4 text-lg font-semibold text-foreground">
              {user.name}
            </p>
            <p className="mt-1 flex max-w-full items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{user.email}</span>
            </p>
          </div>

          <Separator className="my-4" />

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Member since</span>
              <span className="font-medium text-foreground">
                {memberSince ?? "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Nationality</span>
              <span className="font-medium text-foreground">Not set</span>
            </div>
          </div>

          <Dialog
            open={editOpen}
            onOpenChange={handleEditOpenChange}
          >
            <DialogTrigger
              render={
                <Button
                  size="lg"
                  className="mt-5 w-full rounded-md bg-brand text-white hover:bg-brand-dark"
                />
              }
            >
              <Pencil />
              Edit Profile
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your display name. It appears across your account.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleSaveName}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="display-name">Display name</Label>
                  <Input
                    id="display-name"
                    name="name"
                    autoComplete="name"
                    required
                    value={nameInput}
                    onChange={(event) => setNameInput(event.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>
                    Cancel
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-brand text-white hover:bg-brand-dark"
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="lg"
            onClick={handleSignOut}
            className="mt-2 w-full rounded-md text-muted-foreground hover:text-foreground"
          >
            <LogOut />
            Sign Out
          </Button>
        </div>

        <div className="animate-rise-in">
          <h2 className="font-heading text-xl text-foreground">
            Travel Statistics
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Total Bookings"
              value={stats.totalBookings}
              icon={<Plane className="size-5" aria-hidden="true" />}
              iconClassName="bg-sky-100 text-sky-600"
            />
            <StatCard
              label="Countries Visited"
              value={stats.countriesVisited}
              icon={<Globe className="size-5" aria-hidden="true" />}
              iconClassName="bg-emerald-100 text-emerald-600"
            />
            <StatCard
              label="Upcoming Trips"
              value={stats.upcomingTrips}
              icon={<TrendingUp className="size-5" aria-hidden="true" />}
              iconClassName="bg-orange-100 text-orange-600"
            />
            <StatCard
              label="Total Spent"
              value={totalSpentLabel}
              icon={<CircleDollarSign className="size-5" aria-hidden="true" />}
              iconClassName="bg-pink-100 text-pink-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
