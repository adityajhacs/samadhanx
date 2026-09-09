"use client";

import React from "react";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: `
      bg-teal-600
      text-white
      shadow-sm
      shadow-teal-600/15
      hover:bg-teal-700
      hover:shadow-md
      focus-visible:ring-teal-500
    `,

    secondary: `
      border border-teal-200
      bg-teal-50
      text-teal-700
      shadow-sm
      hover:border-teal-300
      hover:bg-teal-100
      hover:shadow
      focus-visible:ring-teal-500
    `,

    danger: `
      bg-red-600
      text-white
      shadow-sm
      shadow-red-600/15
      hover:bg-red-700
      hover:shadow-md
      focus-visible:ring-red-500
    `,

    ghost: `
      bg-transparent
      text-slate-600
      hover:bg-teal-50
      hover:text-teal-700
      focus-visible:ring-teal-500
    `,
  };

  const sizes = {
    sm: "h-9 rounded-lg px-3 text-xs",
    md: "h-10 rounded-xl px-4 text-sm",
    lg: "h-12 rounded-xl px-5 text-sm",
  };

  return (
    <button
      {...props}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        whitespace-nowrap
        font-semibold
        transition-all
        duration-200

        active:scale-[0.98]

        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:shadow-none

        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-offset-2

        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}