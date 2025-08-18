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
import { useCallback } from 'react'
import { Plan } from 'commons/models/plan'
import ConfigService from '@/services/config-service'
import ERC20_ABI from 'commons/services/ERC20.json'

/**
 * 钱包连接Hook
 * 提供连接、断开连接和获取钱包状态的功能
 */
export function useWalletConnection() {
  const { address, isConnected, isConnecting } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const connectWallet = useCallback(() => {
    connect({ connector: metaMask() })
  }, [connect])

  return {
    address,
    isConnected,
    isConnecting,
    connectWallet,
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
  }
}
