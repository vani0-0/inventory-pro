"use client";

import { useGetProducts } from "@/hooks/use-products";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BoxesIcon,
  BoxIcon,
  ChevronDownIcon,
  NotebookIcon,
} from "lucide-react";
import { RecentTransactions } from "./recent-transactions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ProductsTable() {
  const { data, isLoading } = useGetProducts();

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <Tabs defaultValue="products">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="products">
            <BoxIcon className="mr-2 h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <NotebookIcon className="mr-2 h-4 w-4" />
            Transactions
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                Add Items <ChevronDownIcon className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <BoxIcon />
                <Link href={"/inventory/add"}>Add Single Item</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BoxesIcon />
                <Link href={"/inventory/bulk-add"}>Bulk Add Items</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Card>
        <TabsContent value="products">
          <CardHeader className="pb-6">
            <CardTitle>Inventory Items</CardTitle>
            <CardDescription>
              Manage your inventory items and stock levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={data} />
          </CardContent>
        </TabsContent>
        <TabsContent value="transactions">
          <CardHeader className="pb-6">
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Recent inventory changes and activities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions />
          </CardContent>
        </TabsContent>
      </Card>
    </Tabs>
  );
}
