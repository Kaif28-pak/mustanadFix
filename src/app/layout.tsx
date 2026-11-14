import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "MustanadFix | Karachi's Most Trusted AC & Appliance Repair",
  description:
    "Hyper-local verified AC and home appliance repair in Clifton, DHA, PECHS, and Gulshan-e-Iqbal. 100% NADRA and Police Cleared technicians with PKR 50,000 SafeGuard Guarantee.",
  keywords: [
    "AC repair Karachi",
    "DHA AC service",
    "Clifton appliance repair",
    "NADRA verified technician",
    "Inverter PCB repair",
    "AC gas refill Karachi",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-900">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
