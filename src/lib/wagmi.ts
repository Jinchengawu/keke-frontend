/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-18 15:00:00
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-18 15:00:00
 * @FilePath: /keke-frontend/src/lib/wagmi.ts
 * @Description: Wagmi配置文件，用于设置Web3连接器和链配置
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, polygon, bsc } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// 获取项目ID (如果使用WalletConnect)
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

/**
 * Wagmi配置
 * 设置支持的链、连接器和传输方式
 */
export const config = createConfig({
  chains: [mainnet, sepolia, polygon, bsc],
  connectors: [
    // MetaMask连接器
    metaMask(),
    // 通用注入式钱包连接器
    injected(),
    // WalletConnect连接器（如果有项目ID）
    ...(projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
  },
})

// 声明模块以获得类型安全
declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
