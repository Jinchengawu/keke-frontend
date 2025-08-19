/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-17 21:37:14
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-19 09:04:37
 * @FilePath: /keke-frontend/src/components/Sidebar/index.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coins, Home, RotateCcw } from 'lucide-react';

export function Sidebar() {
      const pathname = usePathname();
      
    return (
        <div className="bg-white w-1/6 shadow-lg p-8 flex flex-col justify-start items-start divide-y">
            <h2 className="text-xl font-bold uppercase text-cyan-900 pb-8">Poseidon</h2>

            <div className="flex flex-col w-full pt-8">
                <ul className="uppercase text-sm text-gray-500 font-semibold">
                    
                    <li className="p-2">
                        <Link className={`${pathname === '/mint' && "text-blue-500"} flex items-end gap-2`} href="/mint">
                            <Home className="w-4 h-4" />
                            铸造（Mint）
                        </Link>
                    </li>
                    <li className="p-2">
                        <Link className={`${pathname === '/swap' && "text-blue-500"} flex items-end gap-2`} href="/swap">
                            <Coins className="w-4 h-4" />
                            兑换（Swap）
                        </Link>
                    </li>
                    <li className="p-2">
                        <Link className={`${pathname === '/redeem' && "text-blue-500"} flex items-end gap-2`} href="/redeem">
                            <RotateCcw className="w-4 h-4" />
                            赎回（Redeem）
                        </Link>
                    </li>

                </ul>
            </div>
            
        </div>
    )
}