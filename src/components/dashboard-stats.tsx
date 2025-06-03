"use client";

import { useGetOverview } from "@/hooks/use-products";
import { Package, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

function StatSkeletonCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-20 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const { data, isLoading } = useGetOverview();

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <StatSkeletonCard />
        <StatSkeletonCard />
        <StatSkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total.value}</div>
          <p className="text-xs text-muted-foreground">
            {data.total.diff} from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.lowStock.value}</div>
          <p className="text-xs text-muted-foreground">
            {data.lowStock.diff} from last week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.outOfStock.value}</div>
          <p className="text-xs text-muted-foreground">
            {data.outOfStock.diff} from last week
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
