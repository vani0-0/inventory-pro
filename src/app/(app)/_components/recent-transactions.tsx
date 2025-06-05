"use client";

import { useGetTransactions } from "@/hooks/use-transactions";
import { formatDistanceToNow } from "date-fns";
import { ArrowUp, ArrowDown, Minus, Undo2 } from "lucide-react"; // ensure these are imported

const typeConfig = {
  PURCHASE: {
    action: "added",
    icon: <ArrowUp className="h-4 w-4 text-green-600" />,
    bg: "bg-green-100",
  },
  SALE: {
    action: "removed",
    icon: <ArrowDown className="h-4 w-4 text-red-600" />,
    bg: "bg-red-100",
  },
  ADJUSTMENT: {
    action: "adjusted",
    icon: <Minus className="h-4 w-4 text-yellow-600" />,
    bg: "bg-yellow-100",
  },
  RETURN: {
    action: "returned",
    icon: <Undo2 className="h-4 w-4 text-blue-600" />,
    bg: "bg-blue-100",
  },
} as const;

export function RecentTransactions() {
  const { data, isLoading } = useGetTransactions();

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {data.map((activity) => {
        const config = typeConfig[activity.type as keyof typeof typeConfig];
        console.log(config);
        return (
          <div
            key={activity.id}
            className="flex items-start gap-4 rounded-lg border p-4"
          >
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                User{" "}
                <span className="text-muted-foreground">
                  {config.action} {activity.quantity} {activity.item}
                </span>
              </p>
              {activity.reason && (
                <p className="text-xs italic text-muted-foreground">
                  {activity.reason}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.timestamp), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${config.bg}`}
            >
              {config.icon}
            </div>
          </div>
        );
      })}
    </div>
  );
}
