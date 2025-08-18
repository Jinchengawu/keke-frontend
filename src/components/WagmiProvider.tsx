/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-18 15:00:00
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-18 15:00:00
 * @FilePath: /keke-frontend/src/components/WagmiProvider.tsx
 * @Description: Wagmi Provider组件，为应用提供Web3上下文
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider as WagmiProviderBase } from 'wagmi'
import { config } from '@/lib/wagmi'
import { ReactNode, useState } from 'react'

interface WagmiProviderProps {
  children: ReactNode
}

/**
 * Wagmi Provider组件
 * 包装应用以提供Web3功能和查询客户端
 */
export function WagmiProvider({ children }: WagmiProviderProps) {
  // 创建React Query客户端实例
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProviderBase config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProviderBase>
  )
}
