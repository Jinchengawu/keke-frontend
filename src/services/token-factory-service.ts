/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-19 16:30:00
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-19 16:30:00
 * @FilePath: /keke-frontend/src/services/token-factory-service.ts
 * @Description: 代币工厂服务，处理代币创建和发射功能
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

import { createWalletClient, custom, parseEther, getAddress } from 'viem';
import { bscTestnet, bsc, polygon, mainnet } from 'viem/chains';
import TokenFactoryABI from './TokenFactory.json';

// 代币工厂合约地址 (测试网)
const TOKEN_FACTORY_ADDRESSES = {
  bscTestnet: '0x742d35Cc6Db4B3b6F6B30D5d68B7F4F4f4E4A8C9', // BSC 测试网
  bsc: '0x742d35Cc6Db4B3b6F6B30D5d68B7F4F4f4E4A8C9', // BSC 主网 
  polygon: '0x742d35Cc6Db4B3b6F6B30D5d68B7F4F4f4E4A8C9', // Polygon
  mainnet: '0x742d35Cc6Db4B3b6F6B30D5d68B7F4F4f4E4A8C9', // 以太坊主网
};

// 网络配置映射
const NETWORK_CONFIG = {
  56: { chain: bsc, factoryAddress: TOKEN_FACTORY_ADDRESSES.bsc },
  97: { chain: bscTestnet, factoryAddress: TOKEN_FACTORY_ADDRESSES.bscTestnet },
  137: { chain: polygon, factoryAddress: TOKEN_FACTORY_ADDRESSES.polygon },
  1: { chain: mainnet, factoryAddress: TOKEN_FACTORY_ADDRESSES.mainnet },
};

export interface TokenCreationParams {
  name: string;
  symbol: string;
  description: string;
  totalSupply: bigint;
  decimals: number;
  fundraiseValue: number;
  fundraiseCurrency: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  tokenType: string;
  enableLiquidity: boolean;
  tokenImage?: string;
}

export interface TokenCreationResult {
  tokenAddress: string;
  transactionHash: string;
  blockNumber?: number;
  gasUsed?: bigint;
}

/**
 * 获取钱包客户端实例
 * @returns Viem钱包客户端实例
 */
function getWalletClient(chainId: number = 97) {
  if (!window.ethereum) {
    throw new Error('请安装 MetaMask 钱包');
  }

  const networkConfig = NETWORK_CONFIG[chainId as keyof typeof NETWORK_CONFIG];
  if (!networkConfig) {
    throw new Error(`不支持的网络 ID: ${chainId}`);
  }

  return createWalletClient({
    chain: networkConfig.chain,
    transport: custom(window.ethereum)
  });
}

/**
 * 获取当前网络ID
 * @returns 当前连接的网络ID
 */
export async function getCurrentNetworkId(): Promise<number> {
  if (!window.ethereum) {
    throw new Error('请安装 MetaMask 钱包');
  }

  const networkId = await window.ethereum.request({ method: 'eth_chainId' });
  return parseInt(networkId, 16);
}

/**
 * 切换到指定网络
 * @param chainId 目标网络ID
 */
export async function switchNetwork(chainId: number): Promise<void> {
  if (!window.ethereum) {
    throw new Error('请安装 MetaMask 钱包');
  }

  const chainIdHex = `0x${chainId.toString(16)}`;
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    });
  } catch (error: any) {
    // 如果网络不存在，尝试添加网络
    if (error.code === 4902) {
      await addNetwork(chainId);
    } else {
      throw error;
    }
  }
}

/**
 * 添加新网络到钱包
 * @param chainId 网络ID
 */
async function addNetwork(chainId: number): Promise<void> {
  const networkData = {
    97: {
      chainId: '0x61',
      chainName: 'BSC Testnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
      blockExplorerUrls: ['https://testnet.bscscan.com'],
    },
    56: {
      chainId: '0x38',
      chainName: 'BSC Mainnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: ['https://bsc-dataseed.binance.org/'],
      blockExplorerUrls: ['https://bscscan.com'],
    },
  };

  const params = networkData[chainId as keyof typeof networkData];
  if (!params) {
    throw new Error(`不支持添加网络 ID: ${chainId}`);
  }

  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [params],
  });
}

/**
 * 获取用户钱包地址
 * @returns 用户钱包地址
 */
export async function getWalletAddress(): Promise<string> {
  if (!window.ethereum) {
    throw new Error('请安装 MetaMask 钱包');
  }

  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  if (!accounts || accounts.length === 0) {
    throw new Error('请连接 MetaMask 钱包');
  }

  return getAddress(accounts[0]);
}

/**
 * 计算代币创建费用
 * @param fundraiseValue 募集价值
 * @param currency 货币类型
 * @returns 创建费用 (wei)
 */
export function calculateCreationFee(fundraiseValue: number, currency: string): bigint {
  // 基础费用为 0.01 BNB/ETH
  const baseFee = parseEther('0.01');
  
  // 根据募集价值调整费用
  const multiplier = Math.max(1, Math.floor(fundraiseValue / 10));
  
  return baseFee * BigInt(multiplier);
}

/**
 * 创建新代币
 * @param params 代币创建参数
 * @returns 创建结果
 */
export async function createToken(params: TokenCreationParams): Promise<TokenCreationResult> {
  try {
    // 检查并切换到正确的网络 (默认使用 BSC 测试网)
    const currentNetworkId = await getCurrentNetworkId();
    const targetNetworkId = 97; // BSC 测试网
    
    if (currentNetworkId !== targetNetworkId) {
      await switchNetwork(targetNetworkId);
    }

    const walletClient = getWalletClient(targetNetworkId);
    const userAddress = await getWalletAddress();
    
    const networkConfig = NETWORK_CONFIG[targetNetworkId];
    if (!networkConfig) {
      throw new Error('网络配置错误');
    }

    // 计算创建费用
    const creationFee = calculateCreationFee(params.fundraiseValue, params.fundraiseCurrency);

    // 计算总供应量 (考虑小数位)
    const totalSupply = params.totalSupply * BigInt(10 ** params.decimals);

    console.log('Creating token with params:', {
      name: params.name,
      symbol: params.symbol,
      totalSupply: totalSupply.toString(),
      decimals: params.decimals,
      fee: creationFee.toString(),
    });

    // 调用代币工厂合约创建代币
    const hash = await walletClient.writeContract({
      address: networkConfig.factoryAddress as `0x${string}`,
      abi: TokenFactoryABI,
      functionName: 'createToken',
      args: [
        params.name,
        params.symbol,
        totalSupply,
        params.decimals,
      ],
      account: userAddress as `0x${string}`,
      value: creationFee, // 支付创建费用
    });

    console.log('Token creation transaction sent:', hash);

    // 这里可以等待交易确认
    // const receipt = await walletClient.waitForTransactionReceipt({ hash });

    return {
      tokenAddress: '0x0000000000000000000000000000000000000000', // 实际应该从交易回执中获取
      transactionHash: hash,
    };

  } catch (error: any) {
    console.error('Token creation failed:', error);
    
    // 处理用户拒绝交易的情况
    if (error.code === 4001) {
      throw new Error('用户取消了交易');
    }
    
    // 处理网络错误
    if (error.code === -32002) {
      throw new Error('钱包中有待处理的请求，请先处理');
    }
    
    // 处理余额不足
    if (error.message?.includes('insufficient funds')) {
      throw new Error('余额不足，无法支付创建费用');
    }

    throw new Error(`代币创建失败: ${error.message || '未知错误'}`);
  }
}

/**
 * 获取已创建的代币列表
 * @returns 代币地址列表
 */
export async function getDeployedTokens(): Promise<string[]> {
  const currentNetworkId = await getCurrentNetworkId();
  const walletClient = getWalletClient(currentNetworkId);
  
  const networkConfig = NETWORK_CONFIG[currentNetworkId as keyof typeof NETWORK_CONFIG];
  if (!networkConfig) {
    throw new Error('不支持的网络');
  }

  try {
    const result = await walletClient.readContract({
      address: networkConfig.factoryAddress as `0x${string}`,
      abi: TokenFactoryABI,
      functionName: 'getDeployedTokens',
    });

    return result as string[];
  } catch (error) {
    console.error('Failed to get deployed tokens:', error);
    return [];
  }
}

/**
 * 获取代币详情
 * @param tokenAddress 代币地址
 * @returns 代币详情
 */
export async function getTokenDetails(tokenAddress: string) {
  const currentNetworkId = await getCurrentNetworkId();
  const walletClient = getWalletClient(currentNetworkId);
  
  const networkConfig = NETWORK_CONFIG[currentNetworkId as keyof typeof NETWORK_CONFIG];
  if (!networkConfig) {
    throw new Error('不支持的网络');
  }

  try {
    const result = await walletClient.readContract({
      address: networkConfig.factoryAddress as `0x${string}`,
      abi: TokenFactoryABI,
      functionName: 'tokenDetails',
      args: [tokenAddress as `0x${string}`],
    });

    return result;
  } catch (error) {
    console.error('Failed to get token details:', error);
    throw new Error('获取代币详情失败');
  }
}

// 导出常量
export { TOKEN_FACTORY_ADDRESSES, NETWORK_CONFIG };
