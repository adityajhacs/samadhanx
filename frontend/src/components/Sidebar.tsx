"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AlertCircle,
  Network,
  Map,
  FolderKanban,
  ChevronRight,
  Settings,
  CircleHelp,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

/* =========================================================
   NAVIGATION DATA
   ========================================================= */

const mainNavigation = [
  {
    name: "Overview",
    href: "/government/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Community Challenges",
    href: "/government/problems",
    icon: AlertCircle,
    badge: "128",
  },
  {
    name: "Challenge Clusters",
    href: "/government/clusters",
    icon: Network,
  },
  {
    name: "Impact Map",
    href: "/government/map",
    icon: Map,
    live: true,
  },
  {
    name: "Innovation Projects",
    href: "/government/projects",
    icon: FolderKanban,
  },
];

/* =========================================================
   SIDEBAR
   ========================================================= */

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/government/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <aside
      className="
        fixed left-0 top-[74px] z-40
        hidden h-[calc(100vh-74px)]
        w-[260px]
        flex-col
        border-r border-slate-200
        bg-white
        lg:flex
      "
    >
      {/* =====================================================
          PORTAL IDENTITY
         ===================================================== */}

      <div className="px-4 pt-5">
        <div
          className="
            relative overflow-hidden
            rounded-2xl
            border border-slate-200
            bg-teal-50/70
            p-4
          "
        >
          {/* Decorative circle */}
          <div
            className="
              pointer-events-none
              absolute -right-8 -top-8
              h-24 w-24
              rounded-full
              bg-teal-200/40
            "
          />

          <div className="relative flex items-center gap-3">
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl
                bg-teal-600
                text-white
                shadow-sm
              "
            >
              <ShieldCheck size={21} strokeWidth={2} />
            </div>

            <div className="min-w-0">
              <p className="text-[12px] font-bold text-slate-900">
                Government Workspace
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                <span className="text-[10px] font-medium text-slate-500">
                  Platform operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN NAVIGATION
         ===================================================== */}

      <div className="mt-6 flex-1 overflow-y-auto px-3">
        <p
          className="
            mb-2 px-3
            text-[10px]
            font-bold
            uppercase
            tracking-[0.14em]
            text-slate-400
          "
        >
          Workspace
        </p>

        <nav className="space-y-1">
          {mainNavigation.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group relative flex items-center gap-3
                  rounded-xl px-3 py-2.5
                  transition-all duration-200

                  ${
                    active
                      ? "bg-teal-50 text-teal-700 shadow-[inset_3px_0_0_#0d9488]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-teal-700"
                  }
                `}
              >
                {/* Icon */}
                <span
                  className={`
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-lg
                    transition-all duration-200

                    ${
                      active
                        ? "bg-teal-100 text-teal-700"
                        : "bg-transparent text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600"
                    }
                  `}
                >
                  <Icon size={18} strokeWidth={1.9} />
                </span>

                {/* Label */}
                <span
                  className={`
                    flex-1
                    text-[13px]
                    font-semibold

                    ${
                      active
                        ? "text-teal-700"
                        : "text-slate-600 group-hover:text-teal-700"
                    }
                  `}
                >
                  {item.name}
                </span>

                {/* Badge */}
                {item.badge && (
                  <span
                    className="
                      rounded-full
                      bg-amber-50
                      px-2 py-0.5
                      text-[9px]
                      font-bold
                      text-amber-700
                    "
                  >
                    {item.badge}
                  </span>
                )}

                {/* Live indicator */}
                {item.live && (
                  <span className="flex items-center gap-1.5">
                    <span
                      className="
                        h-1.5 w-1.5
                        rounded-full
                        bg-green-500
                        shadow-[0_0_0_3px_rgba(34,197,94,0.10)]
                      "
                    />

                    <span className="text-[9px] font-bold text-green-600">
                      LIVE
                    </span>
                  </span>
                )}

                {/* Arrow */}
                {!item.badge && !item.live && (
                  <span
                    className={`
                      transition-all duration-200

                      ${
                        active
                          ? "translate-x-0 text-teal-600 opacity-100"
                          : "-translate-x-1 text-slate-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }
                    `}
                  >
                    <ChevronRight size={15} strokeWidth={2} />
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* =====================================================
            INSIGHTS
           ===================================================== */}

        <div className="mt-7">
          <p
            className="
              mb-2 px-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-slate-400
            "
          >
            Insights
          </p>

          <div
            className="
              rounded-xl
              border border-slate-200
              bg-slate-50
              p-3
            "
          >
            <div className="flex items-start gap-2.5">
              <div
                className="
                  flex h-7 w-7 shrink-0
                  items-center justify-center
                  rounded-lg
                  bg-teal-100
                  text-teal-700
                "
              >
                <TrendingUp size={14} strokeWidth={2} />
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-900">
                  Resolution rate
                </p>

                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[18px] font-bold text-teal-700">
                    78.4%
                  </span>

                  <span className="text-[9px] font-semibold text-green-600">
                    +6.2%
                  </span>
                </div>

                <p className="mt-0.5 text-[9px] text-slate-400">
                  Compared with last month
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SYSTEM
           ===================================================== */}

        <div className="mt-7">
          <p
            className="
              mb-2 px-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-slate-400
            "
          >
            System
          </p>

          <nav className="space-y-1">
            {/* Settings */}
            <button
              type="button"
              className="
                group flex w-full items-center gap-3
                rounded-xl px-3 py-2.5
                text-left
                text-slate-600
                transition-all duration-200
                hover:bg-slate-50
                hover:text-teal-700
              "
            >
              <span
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-lg
                  text-slate-400
                  transition-colors
                  group-hover:bg-teal-50
                  group-hover:text-teal-600
                "
              >
                <Settings size={18} strokeWidth={1.9} />
              </span>

              <span className="text-[13px] font-semibold">
                Settings
              </span>
            </button>

            {/* Help */}
            <button
              type="button"
              className="
                group flex w-full items-center gap-3
                rounded-xl px-3 py-2.5
                text-left
                text-slate-600
                transition-all duration-200
                hover:bg-slate-50
                hover:text-teal-700
              "
            >
              <span
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-lg
                  text-slate-400
                  transition-colors
                  group-hover:bg-teal-50
                  group-hover:text-teal-600
                "
              >
                <CircleHelp size={18} strokeWidth={1.9} />
              </span>

              <span className="text-[13px] font-semibold">
                Help & Support
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* =====================================================
          FOOTER / ADMIN PROFILE
         ===================================================== */}

      <div className="border-t border-slate-200 p-3">
        <div
          className="
            flex items-center gap-3
            rounded-xl
            border border-slate-200
            bg-slate-50
            p-2.5
          "
        >
          <div
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-lg
              bg-teal-600
              text-[10px]
              font-bold
              text-white
            "
          >
            AO
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-bold text-slate-900">
              Admin Officer
            </p>

            <p className="truncate text-[9px] font-medium text-slate-500">
              District Administration
            </p>
          </div>

          <span className="h-2 w-2 rounded-full bg-green-500" />
        </div>
      </div>
    </aside>
  );
}