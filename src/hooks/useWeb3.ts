/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-18 15:00:00
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-18 15:00:00
 * @FilePath: /keke-frontend/src/hooks/useWeb3.ts
 * @Description: 自定义Web3 Hooks，基于wagmi封装常用的Web3功能
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

'use client'

import { useAccount, useConnect, useDisconnect, useWriteContract } from 'wagmi'
import { metaMask } from 'wagmi/connectors'
import { useCallback, useState } from 'react'
import { Plan } from 'commons/models/plan'
import ConfigService from '@/services/config-service'
import ERC20_ABI from 'commons/services/ERC20.json'
import { isOKXWallet, isBinanceWallet, okxWallet, binanceWallet } from '@/lib/wagmi'

// 钱包类型定义
export type WalletType = 'metamask' | 'okx' | 'binance' | 'injected'

// 可用钱包列表
export interface AvailableWallet {
  type: WalletType
  name: string
  isInstalled: boolean
  icon?: string
}

/**
 * 钱包连接Hook
 * 提供连接、断开连接和获取钱包状态的功能，支持多种钱包
 */
export function useWalletConnection() {
  const { address, isConnected, isConnecting, connector } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null)

  // 检测可用钱包
  const getAvailableWallets = useCallback((): AvailableWallet[] => {
    const wallets: AvailableWallet[] = [
      {
        type: 'metamask',
        name: 'MetaMask',
        isInstalled: typeof window !== 'undefined' && !!window.ethereum?.isMetaMask,
      },
      {
        type: 'okx',
        name: 'OKX Wallet',
        isInstalled: isOKXWallet(),
      },
      {
        type: 'binance',
        name: 'Binance Wallet',
        isInstalled: isBinanceWallet(),
      },
      {
        type: 'injected',
        name: '其他钱包',
        isInstalled: typeof window !== 'undefined' && !!window.ethereum,
      }
    ]
    
    return wallets
  }, [])

  // 连接指定类型的钱包
  const connectWallet = useCallback((walletType: WalletType) => {
    setSelectedWallet(walletType)
    
    try {
      switch (walletType) {
        case 'metamask':
          connect({ connector: metaMask() })
          break
        case 'okx':
          connect({ connector: okxWallet() })
          break
        case 'binance':
          connect({ connector: binanceWallet() })
          break
        case 'injected':
        default:
          // 使用通用注入式连接器作为兜底
          connect({ connector: metaMask() })
          break
      }
    } catch (error) {
      console.error(`连接${walletType}钱包失败:`, error)
      setSelectedWallet(null)
      throw error
    }
  }, [connect])

  // 连接默认钱包（保持向后兼容）
  const connectDefaultWallet = useCallback(() => {
    connectWallet('metamask')
  }, [connectWallet])

  // 获取当前连接的钱包类型
  const getCurrentWalletType = useCallback((): WalletType | null => {
    if (!connector) return null
    
    switch (connector.id) {
      case 'metaMask':
        return 'metamask'
      case 'okx':
        return 'okx'
      case 'binance':
        return 'binance'
      default:
        return 'injected'
    }
  }, [connector])

  return {
    address,
    isConnected,
    isConnecting,
    selectedWallet,
    currentWalletType: getCurrentWalletType(),
    getAvailableWallets,
    connectWallet,
    connectDefaultWallet,
    disconnect,
  }
}



/**
 * ERC20代币交互Hook
 * 提供代币授权和转账等功能
 */
export function useERC20() {
  const { writeContractAsync } = useWriteContract()

  const approveToken = useCallback(async (plan: Plan): Promise<boolean> => {
    try {
      const hash = await writeContractAsync({
        address: plan.tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [
          ConfigService.POSEIDON_PAY_CONTRACT as `0x${string}`,
          BigInt(plan.price) * BigInt(12)
        ],
      })

      console.log('Transaction hash:', hash)
      return true
    } catch (error) {
      console.error('Approval failed:', error)
      throw error
    }
  }, [writeContractAsync])

  return {
    approveToken,
  }
}

/**
 * 综合Web3 Hook
 * 组合所有Web3功能，提供统一的接口
 */
export function useWeb3() {
  const wallet = useWalletConnection()
  const erc20 = useERC20()

  return {
    ...wallet,
    ...erc20,
    // 确保向后兼容性，保留原有的 connectWallet 方法
    connectWallet: wallet.connectDefaultWallet,
  }
}
