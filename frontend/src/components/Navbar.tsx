
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  ChevronDown,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const isDashboard = pathname === "/government/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ================= LEFT — BRAND ================= */}

        <div className="flex min-w-0 items-center gap-4">

          {/* SamadhanX Logo */}

          <Link
            href="/government/dashboard"
            className="group flex items-center gap-3"
          >
            <div
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-xl
                bg-teal-600
                text-white
                shadow-sm
                transition-all duration-200
                group-hover:bg-teal-700
                group-hover:shadow-md
              "
            >
              <ShieldCheck
                size={23}
                strokeWidth={2}
              />
            </div>

            {/* Brand Name */}

            <div className="hidden sm:block">
              <div className="flex items-center gap-2">

                <span className="text-[18px] font-bold tracking-tight text-slate-900">
                  SamadhanX
                </span>

                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-teal-700">
                  GOV
                </span>

              </div>

              <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                Ideas → Action → Impact
              </p>
            </div>
          </Link>

          {/* Divider */}

          <div className="hidden h-8 w-px bg-slate-200 lg:block" />

          {/* Government Workspace */}

          <div className="hidden items-center gap-2 lg:flex">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <LayoutDashboard
                size={17}
                strokeWidth={2}
              />
            </div>

            <div>
              <p className="text-[12px] font-semibold text-slate-700">
                Government Workspace
              </p>

              <p className="text-[10px] text-slate-400">
                Turning challenges into action
              </p>
            </div>

          </div>
        </div>

        {/* ================= RIGHT — ACTIONS ================= */}

        <div className="flex items-center gap-2 sm:gap-3">

          {/* Search */}

          <button
            type="button"
            className="
              hidden h-10 items-center gap-2 rounded-xl
              border border-slate-200
              bg-slate-50
              px-3.5
              text-slate-500
              transition-all duration-200
              hover:border-teal-200
              hover:bg-teal-50
              hover:text-teal-700
              md:flex
            "
            aria-label="Search"
          >
            <Search
              size={18}
              strokeWidth={1.8}
            />

            <span className="text-xs font-medium">
              Search
            </span>

            <span className="ml-3 hidden rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-semibold text-slate-400 lg:block">
              /
            </span>
          </button>

          {/* Notifications */}

          <button
            type="button"
            className="
              relative flex h-10 w-10 items-center justify-center
              rounded-xl
              border border-slate-200
              bg-white
              text-slate-600
              transition-all duration-200
              hover:border-teal-200
              hover:bg-teal-50
              hover:text-teal-700
            "
            aria-label="Notifications"
          >
            <Bell
              size={19}
              strokeWidth={1.8}
            />

            <span
              className="
                absolute right-[8px] top-[7px]
                h-2 w-2 rounded-full
                border-2 border-white
                bg-red-500
              "
            />
          </button>

          {/* Admin Profile */}

          <button
            type="button"
            className="
              flex items-center gap-2 rounded-xl
              border border-slate-200
              bg-white
              py-1.5 pl-1.5 pr-2.5
              transition-all duration-200
              hover:border-teal-200
              hover:bg-slate-50
            "
          >

            {/* Avatar */}

            <div
              className="
                flex h-8 w-8 items-center justify-center
                rounded-lg
                bg-teal-600
                text-[11px]
                font-bold
                text-white
              "
            >
              AD
            </div>

            {/* Profile Information */}

            <div className="hidden text-left sm:block">

              <p className="text-[11px] font-bold leading-4 text-slate-900">
                Admin Officer
              </p>

              <p className="text-[9px] font-medium leading-3 text-slate-500">
                Government
              </p>

            </div>

            <span className="hidden text-slate-400 sm:block">
              <ChevronDown
                size={16}
                strokeWidth={2}
              />
            </span>

          </button>
        </div>
      </div>

      {/* ================= ACTIVE PAGE ACCENT ================= */}

      {isDashboard && (
        <div className="h-[2px] w-full bg-teal-600" />
      )}
    </header>
  );
}
