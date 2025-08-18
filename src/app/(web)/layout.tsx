/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-18 23:24:48
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-18 23:58:07
 * @FilePath: /keke-frontend/src/app/(web)/layout.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
import { Sidebar } from "@/components/Sidebar";
import Head from "@/components/Head";
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
        <Head/>
        <Sidebar />
        {children}
    </div>
  );
}
