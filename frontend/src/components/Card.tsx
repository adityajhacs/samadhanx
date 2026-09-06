import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  accent?: "teal" | "blue" | "amber" | "red" | "none";
}

export default function Card({
  children,
  className = "",
  title,
  description,
  accent = "none",
}: CardProps) {
  const accentStyles = {
    teal: "border-l-4 border-l-teal-500",
    blue: "border-l-4 border-l-sky-500",
    amber: "border-l-4 border-l-amber-500",
    red: "border-l-4 border-l-red-500",
    none: "",
  };

  return (
    <section
      className={`
        group relative overflow-hidden
        rounded-2xl
        border border-slate-200/80
        bg-white
        shadow-[0_4px_20px_rgba(15,23,42,0.05)]
        transition-all duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_12px_35px_rgba(15,23,42,0.10)]
        ${accentStyles[accent]}
        ${className}
      `}
    >
      {/* subtle teal glow */}
      <div
        className="
          pointer-events-none absolute -right-12 -top-12
          h-28 w-28 rounded-full
          bg-teal-400/10 blur-2xl
          transition-all duration-300
          group-hover:bg-teal-400/20
        "
      />

      {(title || description) && (
        <div className="relative border-b border-slate-100 px-5 py-4">
          {title && (
            <h3 className="text-base font-semibold tracking-tight text-slate-900">
              {title}
            </h3>
          )}

          {description && (
            <p className="mt-1 text-sm leading-5 text-slate-500">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="relative">{children}</div>
    </section>
  );
}