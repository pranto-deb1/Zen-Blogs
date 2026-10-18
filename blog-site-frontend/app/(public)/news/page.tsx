import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPublicNews } from "../_actions/getPublicNews";

type Post = {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  views: number;
  createdAt: string;
  user: { id: string; name: string; email: string };
};

/* ---------- Card ---------- */
function PostCard({ post }: { post: Post }) {
  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const initials = post.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      href={`/news/${post.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg bg-white ring-1 ring-zinc-200/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-zinc-300 dark:bg-zinc-900 dark:ring-zinc-800"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {post.thumbnail ? (
          <Image
            unoptimized
            src={post.thumbnail}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400">
            No image
          </div>
        )}

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />

        {/* Floating tags */}
        {post.tags?.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded bg-white/90 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-zinc-800 backdrop-blur-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Views badge */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3 w-3"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {post.views}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-6 md:p-7">
        <h3 className="line-clamp-2 text-xl font-semibold leading-snug tracking-tight text-zinc-900 transition-colors group-hover:text-indigo-600 md:text-2xl dark:text-zinc-100 dark:group-hover:text-indigo-400">
          {post.title}
        </h3>

        <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600 md:text-[15px] dark:text-zinc-400">
          {post.content}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-5 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                {post.user.name}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-500">
                {date}
              </span>
            </div>
          </div>

          <div
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-indigo-600 transition-all hover:gap-2 dark:text-indigo-400"
          >
            Read
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="h-3.5 w-3.5"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ---------- Skeleton ---------- */
function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-lg bg-white ring-1 ring-zinc-200/70 dark:bg-zinc-900 dark:ring-zinc-800">
      <div className="aspect-[16/10] w-full bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex flex-col gap-3 p-6 md:p-7">
        <div className="h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-5 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3.5 w-full rounded bg-zinc-100 dark:bg-zinc-800/70" />
        <div className="h-3.5 w-5/6 rounded bg-zinc-100 dark:bg-zinc-800/70" />
        <div className="mt-3 flex items-center gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800">
          <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3.5 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

function NewsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-7 lg:gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/* ---------- Data ---------- */
async function News() {
  const res = await getPublicNews();

  if (!res?.success) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
        Failed to load news. Please try again later.
      </div>
    );
  }

  const posts: Post[] = res.data?.data?.posts ?? [];

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500">No news available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-7 lg:gap-8">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

/* ---------- Page ---------- */
export default function PublicNews() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between md:mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Latest
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Public News
          </h1>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Fresh stories, curated for you.
        </p>
      </header>

      <Suspense fallback={<NewsGridSkeleton />}>
        <News />
      </Suspense>
    </section>
  );
}
