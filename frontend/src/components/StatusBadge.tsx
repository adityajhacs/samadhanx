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
      badge: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
    },

    High: {
      badge: "bg-orange-50 text-orange-700 border-orange-200",
      dot: "bg-orange-500",
    },

    "In Progress": {
      badge: "bg-teal-50 text-teal-700 border-teal-200",
      dot: "bg-teal-500",
    },

    Pending: {
      badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
      dot: "bg-yellow-500",
    },

    Resolved: {
      badge: "bg-green-50 text-green-700 border-green-200",
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
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${currentStyle.badge} ${sizeStyles[size]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${currentStyle.dot}`}
      />

      {status}
    </span>
  );
}