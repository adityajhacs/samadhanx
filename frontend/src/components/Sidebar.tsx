"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* =========================================================
   ICONS
   ========================================================= */

function DashboardIcon() {
  return (
    <svg
      width="19"
      height="19"
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

function ProblemIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.3 3.3h3.4L21 10.6v3.4L13.9 21h-3.8L3 14v-3.4l7.3-7.3Z" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function ClusterIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M8.2 7.1 10.3 16" />
      <path d="m15.8 7.1-2.1 8.9" />
      <path d="M8.5 6h7" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
    </svg>
  );
}

function ProjectIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M8 4v-1h8v1" />
      <path d="M8 9h8" />
      <path d="M8 13h5" />
      <path d="M8 17h3" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function SettingsIcon() {
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
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06-1.9 1.9-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V20h-2.68v-.01a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06-1.9-1.9.06-.06A1.7 1.7 0 0 0 7.8 15a1.7 1.7 0 0 0-1.56-1.04H6v-2.68h.24A1.7 1.7 0 0 0 7.8 10.2a1.7 1.7 0 0 0-.34-1.87L7.4 8.27l1.9-1.9.06.06a1.7 1.7 0 0 0 1.87.34A1.7 1.7 0 0 0 12.27 5.2V5h2.68v.2a1.7 1.7 0 0 0 1.04 1.57 1.7 1.7 0 0 0 1.87-.34l.06-.06 1.9 1.9-.06.06a1.7 1.7 0 0 0-.34 1.87 1.7 1.7 0 0 0 1.56 1.04H21v2.68h-.02A1.7 1.7 0 0 0 19.4 15Z" />
    </svg>
  );
}

function HelpIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M9.7 9a2.4 2.4 0 1 1 4.5 1.2c-.8 1-2.2 1.2-2.2 2.8" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 20 6v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/* =========================================================
   NAVIGATION DATA
   ========================================================= */

const mainNavigation = [
  {
    name: "Overview",
    href: "/government/dashboard",
    icon: DashboardIcon,
  },
  {
    name: "Problems",
    href: "/government/problems",
    icon: ProblemIcon,
    badge: "128",
  },
  {
    name: "Clusters",
    href: "/government/clusters",
    icon: ClusterIcon,
  },
  {
    name: "Live Map",
    href: "/government/map",
    icon: MapIcon,
    live: true,
  },
  {
    name: "Projects",
    href: "/government/projects",
    icon: ProjectIcon,
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
        border-r border-[#dce7e7]
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
            relative overflow-hidden rounded-2xl
            border border-[#dce7e7]
            bg-gradient-to-br from-[#f0fdfa] via-white to-[#ecfeff]
            p-4
          "
        >
          {/* Decorative circle */}
          <div
            className="
              absolute -right-8 -top-8
              h-24 w-24 rounded-full
              bg-[#14b8a6]/10
            "
          />

          <div className="relative flex items-center gap-3">
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl
                bg-[#0f766e]
                text-white
                shadow-[0_6px_16px_rgba(15,118,110,0.18)]
              "
            >
              <ShieldIcon />
            </div>

            <div className="min-w-0">
              <p className="text-[12px] font-bold text-[#102a2a]">
                Government Workspace
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />

                <span className="text-[10px] font-medium text-[#526666]">
                  System operational
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
            text-[10px] font-bold uppercase
            tracking-[0.14em]
            text-[#8a9b9b]
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
                      ? "bg-[#f0fdfa] text-[#0f766e] shadow-[inset_3px_0_0_#0d9488]"
                      : "text-[#526666] hover:bg-[#f8fbfb] hover:text-[#0f766e]"
                  }
                `}
              >
                {/* Icon container */}
                <span
                  className={`
                    flex h-9 w-9 shrink-0 items-center justify-center
                    rounded-lg transition-all duration-200
                    ${
                      active
                        ? "bg-[#ccfbf1] text-[#0f766e]"
                        : "bg-transparent text-[#718383] group-hover:bg-[#f0fdfa] group-hover:text-[#0d9488]"
                    }
                  `}
                >
                  <Icon />
                </span>

                {/* Label */}
                <span
                  className={`
                    flex-1 text-[13px] font-semibold
                    ${
                      active
                        ? "text-[#0f766e]"
                        : "text-[#526666] group-hover:text-[#0f766e]"
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
                      bg-[#fef3c7]
                      px-2 py-0.5
                      text-[9px] font-bold
                      text-[#a16207]
                    "
                  >
                    {item.badge}
                  </span>
                )}

                {/* Live indicator */}
                {item.live && (
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a] shadow-[0_0_0_3px_rgba(22,163,74,0.10)]" />

                    <span className="text-[9px] font-bold text-[#16a34a]">
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
                          ? "translate-x-0 text-[#0d9488] opacity-100"
                          : "-translate-x-1 text-[#9aabab] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }
                    `}
                  >
                    <ChevronIcon />
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* =====================================================
            INSIGHTS SECTION
           ===================================================== */}

        <div className="mt-7">
          <p
            className="
              mb-2 px-3
              text-[10px] font-bold uppercase
              tracking-[0.14em]
              text-[#8a9b9b]
            "
          >
            Insights
          </p>

          <div
            className="
              rounded-xl border border-[#e2eeee]
              bg-[#f8fbfb] p-3
            "
          >
            <div className="flex items-start gap-2.5">
              <div
                className="
                  flex h-7 w-7 shrink-0
                  items-center justify-center
                  rounded-lg bg-[#ccfbf1]
                  text-[#0f766e]
                "
              >
                <span className="text-[12px] font-bold">↗</span>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#102a2a]">
                  Resolution rate
                </p>

                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[18px] font-bold text-[#0f766e]">
                    78.4%
                  </span>

                  <span className="text-[9px] font-semibold text-[#16a34a]">
                    +6.2%
                  </span>
                </div>

                <p className="mt-0.5 text-[9px] text-[#7b8d8d]">
                  Compared with last month
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SYSTEM SECTION
           ===================================================== */}

        <div className="mt-7">
          <p
            className="
              mb-2 px-3
              text-[10px] font-bold uppercase
              tracking-[0.14em]
              text-[#8a9b9b]
            "
          >
            System
          </p>

          <nav className="space-y-1">
            <button
              type="button"
              className="
                group flex w-full items-center gap-3
                rounded-xl px-3 py-2.5
                text-left text-[#526666]
                transition-all duration-200
                hover:bg-[#f8fbfb]
                hover:text-[#0f766e]
              "
            >
              <span
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-lg text-[#718383]
                  transition-colors
                  group-hover:bg-[#f0fdfa]
                  group-hover:text-[#0d9488]
                "
              >
                <SettingsIcon />
              </span>

              <span className="text-[13px] font-semibold">
                Settings
              </span>
            </button>

            <button
              type="button"
              className="
                group flex w-full items-center gap-3
                rounded-xl px-3 py-2.5
                text-left text-[#526666]
                transition-all duration-200
                hover:bg-[#f8fbfb]
                hover:text-[#0f766e]
              "
            >
              <span
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-lg text-[#718383]
                  transition-colors
                  group-hover:bg-[#f0fdfa]
                  group-hover:text-[#0d9488]
                "
              >
                <HelpIcon />
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

      <div className="border-t border-[#e5eeee] p-3">
        <div
          className="
            flex items-center gap-3
            rounded-xl border border-[#e2eeee]
            bg-[#f8fbfb]
            p-2.5
          "
        >
          <div
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-[10px]
              bg-gradient-to-br
              from-[#115e59] to-[#14b8a6]
              text-[10px] font-bold
              text-white
            "
          >
            AO
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-bold text-[#102a2a]">
              Admin Officer
            </p>

            <p className="truncate text-[9px] font-medium text-[#7b8d8d]">
              District Administration
            </p>
          </div>

          <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
        </div>
      </div>
    </aside>
  );
}