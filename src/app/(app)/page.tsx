import { DashboardStats } from "@/components/dashboard-stats";
import { ProductsTable } from "./_components/products-table";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="container-wrapper">
        <div className="container p-4 space-y-6">
          <DashboardStats />
          <ProductsTable />
        </div>
      </main>
    </>
  );
}
