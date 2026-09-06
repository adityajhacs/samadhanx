"use client";

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export default function Loading({
  text = "Loading...",
  fullScreen = false,
}: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative h-10 w-10">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-teal-100" />

        {/* Animated ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-teal-600" />

        {/* Center */}
        <div className="absolute inset-[9px] rounded-full bg-teal-500/15" />
      </div>

      <p className="text-xs font-semibold text-slate-500">
        {text}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-[220px] items-center justify-center">
      {content}
    </div>
  );
}