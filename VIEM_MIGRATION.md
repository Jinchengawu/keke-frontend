# 🚀 Ethers.js → Viem.js + Wagmi 重构指南

本文档记录了将项目从 Ethers.js 迁移到 Viem.js + Wagmi 的完整过程和使用说明。

## 📋 重构概要

### 主要变更
- ✅ 移除 `ethers` 依赖，添加 `viem`、`wagmi` 等现代化 Web3 库
- ✅ 重构 Web3 服务模块，使用 Viem.js API
- ✅ 创建基于 Wagmi 的 React Hooks
- ✅ 更新签名验证逻辑
- ✅ 提供向后兼容的接口

### 技术栈升级
| 旧版本 | 新版本 | 说明 |
|--------|--------|------|
| ethers.js | viem.js | 更现代化的以太坊库 |
| 手动状态管理 | wagmi | React hooks for Ethereum |
| - | @tanstack/react-query | 数据获取和缓存 |

## 🛠️ 新增文件

### 配置文件
- `src/lib/wagmi.ts` - Wagmi 配置，设置链和连接器
- `src/components/WagmiProvider.tsx` - Wagmi Provider 组件

### Hooks
- `src/hooks/useWeb3.ts` - 综合 Web3 功能 hooks
  - `useWalletConnection()` - 钱包连接管理
  - `useWeb3Auth()` - Web3 认证流程  
  - `useERC20()` - ERC20 代币交互
  - `useWeb3()` - 统一接口

### 组件
- `src/components/WalletConnect/index.tsx` - 钱包连接组件
- `src/app/(web)/wallet-demo/page.tsx` - 功能演示页面

## 📝 重构后的文件

### `src/services/web3service.ts`
```typescript
// 旧版本 (ethers)
import { BrowserProvider, Contract } from 'ethers';

// 新版本 (viem)
import { createWalletClient, custom, getAddress } from 'viem';
```

### `src/app/api/auth/signin/route.ts`
```typescript
// 旧版本 (ethers)
import { ethers } from 'ethers';
signer = ethers.verifyMessage(message, secret);

// 新版本 (viem)
import { verifyMessage } from 'viem';
isValid = await verifyMessage({
  address: wallet,
  message: message,
  signature: secret,
});
```

## 🎯 新的使用方式

### 1. 钱包连接
```typescript
import { useWeb3 } from '@/hooks/useWeb3'

function WalletButton() {
  const { address, isConnected, connectWallet, disconnect } = useWeb3()

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected: {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  )
}
```

### 2. Web3 认证
```typescript
import { useWeb3Auth } from '@/hooks/useWeb3'

function AuthButton() {
  const { doLogin, isWalletConnected } = useWeb3Auth()

  const handleAuth = async () => {
    try {
      const jwt = await doLogin()
      console.log('Authentication successful:', jwt)
    } catch (error) {
      console.error('Authentication failed:', error)
    }
  }

  return (
    <button 
      onClick={handleAuth} 
      disabled={!isWalletConnected}
    >
      Authenticate
    </button>
  )
}
```

### 3. ERC20 代币交互
```typescript
import { useERC20 } from '@/hooks/useWeb3'

function PaymentButton({ plan }) {
  const { approveToken } = useERC20()

  const handlePayment = async () => {
    try {
      await approveToken(plan)
      console.log('Token approval successful')
    } catch (error) {
      console.error('Token approval failed:', error)
    }
  }

  return <button onClick={handlePayment}>Approve Payment</button>
}
```

## 🔧 配置设置

### 环境变量
```env
# 可选：WalletConnect 项目 ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# 现有的环境变量保持不变
AUTH_MSG="Sign this message to authenticate with Poseidon Pay: <timestamp>"
JWT_SECRET="your-jwt-secret-key"
POSEIDON_PAY_CONTRACT="0x0000000000000000000000000000000000000000"
```

### Wagmi 配置
```typescript
// src/lib/wagmi.ts
export const config = createConfig({
  chains: [mainnet, sepolia, polygon, bsc],
  connectors: [
    metaMask(),
    injected(),
    // WalletConnect (如果配置了项目ID)
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    // 其他链...
  },
})
```

## 📦 依赖更新

### 新增依赖
```json
{
  "dependencies": {
    "viem": "^2.7.15",
    "wagmi": "^2.5.7", 
    "@wagmi/core": "^2.6.5",
    "@wagmi/connectors": "^4.1.25",
    "@tanstack/react-query": "^5.28.6"
  }
}
```

### 移除依赖
```json
{
  "dependencies": {
    // "ethers": "^6.12.0" // 已移除
  }
}
```

## 🚀 启动和测试

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 访问演示页面
```
http://localhost:3000/wallet-demo
```

## 🔍 类型安全

Viem.js 和 Wagmi 提供了完整的 TypeScript 支持：

```typescript
// 自动类型推断
const { data: balance } = useBalance({
  address: '0x...',
  token: '0x...', // ERC20 token address
})

// 严格的地址类型
const address: `0x${string}` = '0x...'

// 智能合约交互类型安全
const { writeContract } = useWriteContract()
await writeContract({
  address: tokenAddress,
  abi: ERC20_ABI,
  functionName: 'approve', // 自动补全和类型检查
  args: [spender, amount],   // 参数类型验证
})
```

## 📈 性能优势

1. **更小的包体积** - Viem.js 比 Ethers.js 更轻量
2. **更好的类型安全** - 减少运行时错误
3. **内置缓存** - React Query 自动缓存网络请求
4. **优化的重渲染** - Wagmi hooks 智能优化 React 组件更新

## 🔄 向后兼容

原有的 `web3service.ts` 接口保持兼容，现有代码可以继续使用：

```typescript
// 这些函数仍然可用
import { getWallet, doLogin, startPayment } from '@/services/web3service'

// 但推荐使用新的 hooks
import { useWeb3 } from '@/hooks/useWeb3'
```

## 📚 学习资源

- [Viem.js 官方文档](https://viem.sh/)
- [Wagmi 官方文档](https://wagmi.sh/)
- [React Query 文档](https://tanstack.com/query/latest)

## 🐛 常见问题

### Q: 如何处理网络切换？
A: Wagmi 自动处理网络切换，使用 `useSwitchChain` hook。

### Q: 如何监听账户变化？
A: `useAccount` hook 会自动监听账户变化并重新渲染组件。

### Q: 如何处理交易确认？
A: 使用 `useWaitForTransactionReceipt` hook 等待交易确认。

---

*重构完成于 2025-08-18*
