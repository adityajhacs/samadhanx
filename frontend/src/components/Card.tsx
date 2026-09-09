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
        group relative
        overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white
        shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-teal-200
        hover:shadow-md
        ${accentStyles[accent]}
        ${className}
      `}
    >
      {/* Card Header */}
      {(title || description) && (
        <div className="border-b border-slate-100 px-5 py-4">
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

      {/* Card Content */}
      <div>{children}</div>
    </section>
  );
}