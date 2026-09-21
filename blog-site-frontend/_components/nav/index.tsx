"use client";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  FileText,
  LayoutDashboard,
  PenLine,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import Image from "next/image";
import { logOut } from "@/services/logOut";
import { MdLogout } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";
import { Button } from "../ui/button";

// import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/blogs" },
  { label: "About", href: "/about" },
];

interface IUser {
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
    bio: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

interface NavbarProps {
  success: boolean;
  status: number;
  message: string;
  data?: IUser | null;
}

export function Navbar({ user }: { user: NavbarProps }) {
  const [showModal, setShowModal] = useState(false);

  let dashboardLink;

  if (user.data?.role === "ADMIN") dashboardLink = "/admin-dashboard";
  if (user.data?.role === "AUTHOR") dashboardLink = "/author-dashboard";
  if (user.data?.role === "USER") dashboardLink = "/dashboard";

  // const router = useRouter();
  const handleLogOut = async () => {
    try {
      await logOut();
      toast.success("successfully logged out");
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      toast.error(`${error}` || "failed to log out");
    }
  };

  return (
    <>
      {" "}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2"
            aria-label="Inkline home"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              Z
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Zen Blogs
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/notifications"
              className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Notifications"
            >
              <Bell aria-hidden="true" />
            </Link>

            {user.data ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <div className="">
                    <Image
                      src={
                        user.data?.profile.profilePhoto
                          ? (user.data?.profile.profilePhoto as string)
                          : "https://img.magnific.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-2191.jpg?semt=ais_hybrid&w=740&q=80"
                      }
                      width={50}
                      height={50}
                      alt=""
                      className="w-7 h-7 rounded-full"
                    />
                  </div>
                  <span className="hidden text-sm font-medium sm:inline">
                    {user.data?.name ? user.data?.name : "User Name"}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className="hidden size-4 text-muted-foreground sm:block"
                  />
                  <span className="sr-only">Open account menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <p>{user.data?.name ? user.data?.name : "User Name"}</p>
                      <p className="font-normal text-muted-foreground">
                        {user.data?.email
                          ? user.data?.email
                          : "user123@gmail.com"}
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={dashboardLink as string}>
                        <LayoutDashboard aria-hidden="true" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/posts">
                        <FileText aria-hidden="true" />
                        My posts
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/posts/new">
                        <PenLine aria-hidden="true" />
                        Create post
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex justify-start items-center gap-3 w-full"
                    >
                      Profile <FaArrowRight />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex justify-start items-center gap-3 w-full"
                    >
                      Log Out <MdLogout />
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="">
                <Link href={"/login"}>Login</Link>
              </div>
            )}
          </div>
        </div>
        <nav
          aria-label="Mobile navigation"
          className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 md:hidden sm:px-6 lg:px-8"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-gray-800 p-6 shadow-2xl border border-gray-700 text-white transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-100">
                Are you sure?
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Are you sure you want to log out of your account?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 mt-6">
              <Button
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogOut}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
