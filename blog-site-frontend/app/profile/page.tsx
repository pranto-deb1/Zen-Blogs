import { Suspense } from "react";
import Image from "next/image";
import { getMe } from "@/services/getMe";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";

interface UserData {
  id: string;
  name: string;
  email: string;
  activeStatus: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  profile: {
    id: string;
    userId: string;
    profilePhoto: string;
    bio: string;
    createdAt: string;
    updatedAt: string;
  };
}

function isActive(status: string) {
  return status?.toUpperCase() === "ACTIVE";
}

async function ProfileDetails() {
  const response = await getMe();
  const user: UserData = response?.data;

  if (!user) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center animate-rise">
        <p className="font-medium text-destructive">
          Could not find any user data
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Refresh the page or try to login again
        </p>
      </div>
    );
  }

  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const active = isActive(user.activeStatus);

  return (
    <article className="animate-rise mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm ring-1 ring-black/[0.02] transition-shadow duration-500 hover:shadow-md dark:ring-white/[0.04]">
      {/* Banner — a quiet tinted band the avatar sits over */}
      <div className="relative h-28 bg-gradient-to-br from-secondary via-muted to-card">
        <Link
          href="/profile/edit"
          className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur transition-colors duration-200 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          Edit profile
        </Link>
      </div>

      <div className="px-6 pb-8 sm:px-8">
        {/* Identity */}
        <header className="-mt-14 flex flex-col items-center gap-5 sm:flex-row sm:items-end">
          <div className="group relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-card bg-muted shadow-lg">
            <Link href={"/profile/edit"} className="group">
              <div className="absolute w-full h-full bg-black/30 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-400">
                <span className="text-2xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"><FaEdit /></span>
              </div>
              <Image
                src={user.profile?.profilePhoto || "/default-avatar.png"}
                alt={user.name}
                fill
                sizes="112px"
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </Link>
          </div>

          <div className="flex-1 space-y-2 pb-1 text-center sm:pb-0 sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:justify-start ">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {user.name}
              </h1>
              <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground mt-2">
                {user.role}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <span
            className="inline-flex items-center gap-2 self-center rounded-full bg-success-surface px-3 py-1 text-xs font-medium text-success sm:self-end sm:pb-1"
            style={
              active
                ? undefined
                : {
                    background: "var(--warning-surface)",
                    color: "var(--warning)",
                  }
            }
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                active ? "animate-pulse-ring bg-success" : "bg-warning"
              }`}
            />
            {user.activeStatus}
          </span>
        </header>

        {/* Bio */}
        <section
          className="animate-rise mt-8 rounded-2xl bg-muted/60 p-5"
          style={{ animationDelay: "120ms" }}
        >
          <p className="text-[15px] leading-relaxed text-foreground/85">
            {user.profile?.bio || (
              <span className="text-muted-foreground">
                এখনো কোনো বায়ো যোগ করা হয়নি। প্রোফাইল সেটিংস থেকে নিজের
                সম্পর্কে কয়েক লাইন লিখুন।
              </span>
            )}
          </p>
        </section>

        {/* Details — hairline rows, not a grid of identical boxes */}
        <dl
          className="animate-rise mt-8 divide-y divide-border border-t border-border"
          style={{ animationDelay: "220ms" }}
        >
          <div className="flex items-baseline justify-between gap-4 py-3.5">
            <dt className="text-sm text-muted-foreground">User ID</dt>
            <dd className="truncate font-mono text-sm text-foreground/90">
              {user.id}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-3.5">
            <dt className="text-sm text-muted-foreground">Date joined</dt>
            <dd className="text-sm font-medium text-foreground/90">
              {formattedDate}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-3.5">
            <dt className="text-sm text-muted-foreground">Latest Update</dt>
            <dd className="text-sm text-foreground/90">
              {new Date(user.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

function ProfileSkeleton() {
  const bar =
    "rounded-md bg-gradient-to-r from-muted via-accent to-muted bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border bg-card">
      <div className={`h-28 ${bar}`} />
      <div className="px-6 pb-8 sm:px-8">
        <div className="-mt-14 flex flex-col items-center gap-5 sm:flex-row sm:items-end">
          <div
            className={`h-28 w-28 shrink-0 rounded-full border-4 border-card ${bar}`}
          />
          <div className="flex-1 space-y-2.5 pb-1">
            <div className={`h-6 w-40 ${bar}`} />
            <div className={`h-4 w-56 ${bar}`} />
          </div>
        </div>
        <div className={`mt-8 h-24 rounded-2xl ${bar}`} />
        <div className="mt-8 space-y-4 border-t border-border pt-4">
          <div className={`h-4 w-full ${bar}`} />
          <div className={`h-4 w-4/5 ${bar}`} />
          <div className={`h-4 w-3/5 ${bar}`} />
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <main className="max-h-screen bg-background px-4 py-12 lg:mt-50">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileDetails />
      </Suspense>
    </main>
  );
}
