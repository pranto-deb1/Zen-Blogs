"use client";
import React, { useState } from "react";
import { User, Settings, Bell, Bookmark, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";

function ProfileNavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Bookmark, label: "Bookmark", href: "/bookmarks" },
    { icon: Bell, label: "Notification", href: "/notifications" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* মোবাইল টগল বাটন (Positioning অপরিবর্তিত রাখা হয়েছে) */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-15 right-4 z-50 p-2 rounded-md bg-background border shadow-sm text-foreground hover:bg-accent transition-transform duration-200 active:scale-95"
        aria-label="Toggle Navigation"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* ব্যাকড্রপ overlay (Fade In / Fade Out ট্রানজিশন সহ) */}
      <div
        onClick={toggleSidebar}
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* নেভিগেশন সাইডবার (Slide In / Slide Out ট্রানজিশন সহ) */}
      <aside
        className={`fixed left-0 top-0 h-full border-r bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 transition-all duration-300 ease-in-out z-50 flex flex-col justify-between py-4 px-3 overflow-hidden w-64 md:w-16 md:hover:w-48 group ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* উপরের নেভিগেশন আইটেমসমূহ */}
        <div className="flex flex-col gap-4">
          {/* লোগো বা ব্র্যান্ড */}
          <div className="flex items-center gap-3 px-2 py-1.5">
            {/* <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
              P
            </div> */}
            <span className="font-semibold text-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Dashboard
            </span>
          </div>

          <nav className="flex flex-col gap-1 mt-4">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-2.5 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors duration-200"
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="text-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* নিচের লগআউট বাটন */}
        <div>
          <button
            className="w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors duration-200"
            onClick={() => {
              console.log("Log out");
              setIsOpen(false);
            }}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="text-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default ProfileNavBar;
