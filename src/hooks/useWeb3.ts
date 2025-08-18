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

import { useAccount, useConnect, useDisconnect, useSignMessage, useWriteContract } from 'wagmi'
import { metaMask } from 'wagmi/connectors'
import { useCallback } from 'react'
import { Plan } from 'commons/models/plan'
import ConfigService from '@/services/config-service'
import { signIn, parseJwt } from '@/services/auth-service'
import { JWT } from 'commons/models/jwt'
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
 * Web3认证Hook
 * 处理基于签名的用户认证流程
 */
export function useWeb3Auth() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const doLogin = useCallback(async (): Promise<JWT | undefined> => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    console.log('doLogin')
    const timestamp = Date.now()
    const message = ConfigService.getAuthMessage()

    try {
      console.log('Signing message:', message)
      const challenge = await signMessageAsync({
        message: message,
      })

      const tokenObj = await signIn({
        secret: challenge,
        timestamp,
        wallet: address
      })

      console.log('tokenObj', tokenObj)
      const token = tokenObj.token
      localStorage.setItem('token', token)

      return parseJwt(token)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }, [address, signMessageAsync])

  return {
    doLogin,
    isWalletConnected: !!address,
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
  const auth = useWeb3Auth()
  const erc20 = useERC20()

  return {
    ...wallet,
    ...auth,
    ...erc20,
  }
}
