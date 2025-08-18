/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-17 21:37:14
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-18 15:00:00
 * @FilePath: /keke-frontend/src/services/web3service.ts
 * @Description: Web3服务模块，处理区块链钱包连接、用户认证和支付功能（使用Viem.js重构）
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
// 导入配置服务，用于获取应用配置信息
import ConfigService from './config-service';
// 从viem库导入必要的功能
import { createWalletClient, custom, getAddress } from 'viem';
import { mainnet } from 'viem/chains';
// 导入计划/套餐模型类型定义
import { Plan } from 'commons/models/plan';
// 导入ERC20代币标准的ABI(应用程序二进制接口)，用于与ERC20代币合约交互
import ERC20_ABI from 'commons/services/ERC20.json';

/**
 * 获取钱包客户端实例
 * 检查浏览器是否安装了MetaMask钱包，并返回Viem钱包客户端实例
 * @returns {WalletClient} Viem钱包客户端实例
 * @throws {Error} 如果未检测到MetaMask钱包则抛出错误
 */
function getWalletClient() {
    // 检查浏览器window对象中是否存在ethereum属性（MetaMask注入的对象）
    if(!window.ethereum) {
        // 如果没有找到MetaMask，抛出错误提示用户安装
        throw new Error('No Metamask found');
    }
    // 返回基于MetaMask的Viem钱包客户端实例，用于后续区块链交互
    return createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum)
    });
}

/**
 * 获取用户的以太坊钱包地址
 * 请求用户连接MetaMask钱包并获取账户地址
 * @returns {Promise<string>} 返回用户的第一个以太坊钱包地址
 * @throws {Error} 如果用户拒绝连接或没有可用账户则抛出错误
 */
export async function getWallet(): Promise<string> {
    // 获取钱包客户端实例
    const walletClient = getWalletClient();
    // 控制台输出钱包客户端信息，用于调试
    console.log('getWalletClient', walletClient);
    
    // 向MetaMask发送请求，要求用户授权访问账户列表
    // eth_requestAccounts 是以太坊标准RPC方法，会弹出MetaMask连接确认窗口
    const accounts = await walletClient.request({
        method: 'eth_requestAccounts',
    });

    // 检查是否成功获取到账户列表
    if(!accounts || accounts.length === 0) {
        // 如果没有获取到账户，说明用户拒绝了连接请求或没有可用账户
        throw new Error('Metamask did not allow access to accounts');
    }

    // 获取用户授权的第一个钱包地址
    const firstAllowedWallet = getAddress(accounts[0]); // 使用viem的getAddress来规范化地址格式
    // 将钱包地址保存到浏览器本地存储中，便于后续使用
    localStorage.setItem('wallet', firstAllowedWallet);

    // 返回钱包地址
    return firstAllowedWallet;
}



/**
 * 启动支付流程
 * 批准Poseidon Pay合约使用用户的ERC20代币进行支付
 * @param {Plan} plan 包含代币地址和价格信息的付费计划对象
 * @returns {Promise<boolean>} 支付授权成功返回true
 */
export async function startPayment(plan: Plan): Promise<boolean> {
    // 获取钱包客户端实例
    const walletClient = getWalletClient();
    // 获取用户钱包地址
    const wallet = await getWallet();
    
    // 使用Viem的writeContract方法调用代币合约的approve方法
    // 授权Poseidon Pay合约使用指定数量的代币
    const hash = await walletClient.writeContract({
        address: plan.tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [
            ConfigService.POSEIDON_PAY_CONTRACT as `0x${string}`,
            BigInt(plan.price) * BigInt(12) // 授权金额为计划价格乘以12（可能是12个月的年度订阅）
        ],
        account: wallet as `0x${string}`,
    });
    
    // 这里可以选择等待交易确认，但在这个简化版本中我们直接返回成功
    console.log('Transaction hash:', hash);
    
    // 返回成功状态
    return true;
}