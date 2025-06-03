import { PackageIcon } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b shrink-0 sticky top-0 z-50 transition-all bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full mx-auto max-w-[1400px] min-[1800px]:max-w-screen-2xl">
        <div className="container h-14 flex items-center">
          <div className="flex items-center gap-2">
            <PackageIcon className="h-6 w-6" />
            <span className="text-lg font-semibold">InventoryPro</span>
          </div>
        </div>
      </div>
    </header>
  );
}
