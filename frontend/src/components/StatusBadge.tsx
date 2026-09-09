"use client";

interface StatusBadgeProps {
  status: "Critical" | "High" | "In Progress" | "Pending" | "Resolved";
  size?: "sm" | "md";
}

export default function StatusBadge({
  status,
  size = "md",
}: StatusBadgeProps) {
  const styles: Record<
    StatusBadgeProps["status"],
    {
      badge: string;
      dot: string;
    }
  > = {
    Critical: {
      badge: "border-red-200 bg-red-50 text-red-700",
      dot: "bg-red-500",
    },

    High: {
      badge: "border-orange-200 bg-orange-50 text-orange-700",
      dot: "bg-orange-500",
    },

    "In Progress": {
      badge: "border-teal-200 bg-teal-50 text-teal-700",
      dot: "bg-teal-500",
    },

    Pending: {
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    },

    Resolved: {
      badge: "border-green-200 bg-green-50 text-green-700",
      dot: "bg-green-500",
    },
  };

  const sizeStyles = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  const currentStyle = styles[status];

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        font-medium
        whitespace-nowrap
        ${currentStyle.badge}
        ${sizeStyles[size]}
      `}
    >
      <span
        className={`
          h-1.5
          w-1.5
          shrink-0
          rounded-full
          ${currentStyle.dot}
        `}
      />

      {status}
    </span>
  );
}