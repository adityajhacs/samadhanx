"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function GridIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 20 6v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const isDashboard = pathname === "/government/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#dce7e7] bg-white/95 backdrop-blur-xl">
      <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            LEFT — BRAND
           ===================================================== */}

        <div className="flex min-w-0 items-center gap-4">

          {/* Logo */}
          <Link
            href="/government/dashboard"
            className="group flex items-center gap-3"
          >
            <div
              className="
                flex h-11 w-11 shrink-0 items-center justify-center
                rounded-[14px]
                bg-gradient-to-br from-[#115e59] via-[#0d9488] to-[#14b8a6]
                text-white
                shadow-[0_6px_18px_rgba(13,148,136,0.24)]
                transition-transform duration-200
                group-hover:scale-[1.04]
              "
            >
              <ShieldIcon />
            </div>

            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-[18px] font-bold tracking-[-0.02em] text-[#102a2a]">
                  SamadhanX
                </span>

                <span className="rounded-full bg-[#f0fdfa] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#0f766e]">
                  GOV
                </span>
              </div>

              <p className="mt-0.5 text-[11px] font-medium text-[#7b8d8d]">
                Public Problem Resolution Platform
              </p>
            </div>
          </Link>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-[#e5eeee] lg:block" />

          {/* Current section */}
          <div className="hidden items-center gap-2 lg:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0fdfa] text-[#0d9488]">
              <GridIcon />
            </div>

            <div>
              <p className="text-[12px] font-semibold text-[#526666]">
                Government Portal
              </p>

              <p className="text-[10px] text-[#8a9b9b]">
                Administration & Analytics
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT — SEARCH / NOTIFICATION / PROFILE
           ===================================================== */}

        <div className="flex items-center gap-2 sm:gap-3">

          {/* Search */}
          <button
            type="button"
            className="
              hidden h-10 items-center gap-2 rounded-xl
              border border-[#e1ebeb]
              bg-[#f8fbfb]
              px-3.5
              text-[#7b8d8d]
              transition-all duration-200
              hover:border-[#99f6e4]
              hover:bg-[#f0fdfa]
              hover:text-[#0f766e]
              md:flex
            "
            aria-label="Search"
          >
            <SearchIcon />

            <span className="text-xs font-medium">
              Search
            </span>

            <span className="ml-3 hidden rounded-md border border-[#dce7e7] bg-white px-1.5 py-0.5 text-[9px] font-semibold text-[#8a9b9b] lg:block">
              /
            </span>
          </button>

          {/* Notification */}
          <button
            type="button"
            className="
              relative flex h-10 w-10 items-center justify-center
              rounded-xl border border-[#e1ebeb]
              bg-white text-[#526666]
              transition-all duration-200
              hover:border-[#99f6e4]
              hover:bg-[#f0fdfa]
              hover:text-[#0f766e]
            "
            aria-label="Notifications"
          >
            <BellIcon />

            {/* Notification dot */}
            <span className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full border-2 border-white bg-[#ef4444]" />
          </button>

          {/* Profile */}
          <button
            type="button"
            className="
              flex items-center gap-2 rounded-xl
              border border-[#e1ebeb]
              bg-white
              py-1.5 pl-1.5 pr-2.5
              transition-all duration-200
              hover:border-[#99f6e4]
              hover:bg-[#f8fbfb]
            "
          >
            {/* Avatar */}
            <div
              className="
                flex h-8 w-8 items-center justify-center
                rounded-[10px]
                bg-gradient-to-br from-[#0f766e] to-[#14b8a6]
                text-[11px] font-bold text-white
                shadow-sm
              "
            >
              AD
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-[11px] font-bold leading-4 text-[#102a2a]">
                Admin Officer
              </p>

              <p className="text-[9px] font-medium leading-3 text-[#7b8d8d]">
                Government
              </p>
            </div>

            <span className="hidden text-[#7b8d8d] sm:block">
              <ChevronDownIcon />
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================
          ACTIVE PAGE ACCENT
         ===================================================== */}

      {isDashboard && (
        <div className="h-[2px] w-full bg-gradient-to-r from-[#0f766e] via-[#14b8a6] to-transparent" />
      )}
    </header>
  );
}