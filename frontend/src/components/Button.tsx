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
      bg-teal-600 text-white
      shadow-sm shadow-teal-600/20
      hover:bg-teal-700
      focus-visible:ring-teal-500
    `,

    secondary: `
      border border-teal-200
      bg-teal-50 text-teal-700
      hover:border-teal-300
      hover:bg-teal-100
      focus-visible:ring-teal-500
    `,

    danger: `
      bg-red-600 text-white
      shadow-sm shadow-red-600/20
      hover:bg-red-700
      focus-visible:ring-red-500
    `,

    ghost: `
      bg-transparent text-slate-600
      hover:bg-teal-50
      hover:text-teal-700
      focus-visible:ring-teal-500
    `,
  };

  const sizes = {
    sm: "h-9 px-3 text-xs rounded-lg",
    md: "h-10 px-4 text-sm rounded-xl",
    lg: "h-12 px-5 text-sm rounded-xl",
  };

  return (
    <button
      {...props}
      className={`
        inline-flex items-center justify-center
        gap-2
        font-semibold
        whitespace-nowrap
        transition-all duration-200
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-50
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