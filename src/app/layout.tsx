import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { TanstackProvider } from "@/components/tanstack-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <TanstackProvider>{children}</TanstackProvider>
        <Toaster closeButton richColors />
      </body>
    </html>
  );
}
