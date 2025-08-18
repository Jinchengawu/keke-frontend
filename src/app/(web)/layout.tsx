import { Sidebar } from "@/components/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Poseidon - Web3 DeFi Platform",
  description: "Web3 DeFi platform for token swapping, minting and redemption",
};

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex bg-slate-100 items-stretch">
        <Sidebar />
        {children}
    </div>
  );
}
