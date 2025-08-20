/*
 * 演示：使用Wagmi覆盖Viem功能的示例
 * 这个文件展示如何用Wagmi的API替换Viem的直接调用
 */

import { readContract, writeContract, getAccount } from '@wagmi/core'
import { config } from '@/lib/wagmi'
import TokenFactoryABI from './TokenFactory.json'

// 使用Wagmi的readContract替换Viem的publicClient.readContract
export async function getDeployedTokensWithWagmi(): Promise<string[]> {
  try {
    const result = await readContract(config, {
      address: '0x742d35Cc6Db4B3b6F6B30D5d68B7F4F4f4E4A8C9' as `0x${string}`,
      abi: TokenFactoryABI,
      functionName: 'getDeployedTokens',
    })

    return result as string[]
  } catch (error) {
    console.error('Failed to get deployed tokens:', error)
    return []
  }
}

// 使用Wagmi的writeContract替换Viem的walletClient.writeContract
export async function createTokenWithWagmi(params: any) {
  try {
    const hash = await writeContract(config, {
      address: '0x742d35Cc6Db4B3b6F6B30D5d68B7F4F4f4E4A8C9' as `0x${string}`,
      abi: TokenFactoryABI,
      functionName: 'createToken',
      args: [
        params.name,
        params.symbol,
        params.totalSupply,
        params.decimals
      ],
    })

    return { transactionHash: hash }
  } catch (error) {
    console.error('Token creation failed:', error)
    throw error
  }
}

// 获取账户信息
export function getAccountWithWagmi() {
  return getAccount(config)
}
