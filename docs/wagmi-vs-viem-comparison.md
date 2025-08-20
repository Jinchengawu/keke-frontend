# Wagmi vs Viem 功能对比分析

## 🔄 API对比表

| 功能 | Viem方式 | Wagmi方式 | 推荐场景 |
|------|----------|-----------|----------|
| **读取合约** | `publicClient.readContract()` | `readContract()` 或 `useReadContract()` | Wagmi更简单 |
| **写入合约** | `walletClient.writeContract()` | `writeContract()` 或 `useWriteContract()` | Wagmi有React状态管理 |
| **账户状态** | `walletClient.getAccount()` | `useAccount()` | Wagmi自动更新 |
| **钱包连接** | 手动管理 | `useConnect()` | Wagmi提供完整流程 |
| **网络切换** | `walletClient.switchChain()` | `useSwitchChain()` | Wagmi处理错误更好 |

## ✅ Wagmi的优势

### 1. React集成
```typescript
// Viem: 需要手动管理状态
const [balance, setBalance] = useState(0)
const updateBalance = async () => {
  const result = await publicClient.readContract({...})
  setBalance(result)
}

// Wagmi: 自动状态管理
const { data: balance } = useReadContract({
  address: '0x...',
  abi: ERC20_ABI,
  functionName: 'balanceOf'
})
```

### 2. 自动缓存和重新获取
```typescript
// Wagmi自动处理：
// - 数据缓存
// - 重新验证
// - 错误重试
// - 加载状态
```

### 3. TypeScript支持更好
```typescript
// Wagmi提供完整的类型推断
const { data } = useReadContract({
  address: '0x...',
  abi: contractABI,
  functionName: 'balanceOf', // 自动补全
  args: [address] // 类型检查
})
```

## ⚡ Viem的优势

### 1. 更轻量
- 没有React依赖
- 包体积更小
- 启动更快

### 2. 更直接的控制
```typescript
// 复杂的批量操作
const publicClient = createPublicClient({...})
const results = await Promise.all([
  publicClient.readContract({...}),
  publicClient.readContract({...}),
  publicClient.readContract({...})
])
```

### 3. 服务端适用
- Next.js API路由
- 服务器端组件
- 后端服务

## 🎯 推荐使用策略

### 当前项目建议：

#### 保留双库架构
```typescript
// 🔵 React组件层 - 使用Wagmi
function TokenBalance() {
  const { data: balance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [userAddress]
  })
  
  return <div>余额: {balance}</div>
}

// 🟢 服务层 - 使用Viem
export async function getTokenMetadata(address: string) {
  const publicClient = createPublicClient({...})
  
  const [name, symbol, decimals] = await Promise.all([
    publicClient.readContract({ functionName: 'name' }),
    publicClient.readContract({ functionName: 'symbol' }),
    publicClient.readContract({ functionName: 'decimals' })
  ])
  
  return { name, symbol, decimals }
}
```

#### 迁移路径（如果要统一）
1. **短期**：保持现状，各自发挥优势
2. **中期**：逐步将简单的Viem调用迁移到Wagmi
3. **长期**：根据性能和维护成本决定是否完全统一

## 📊 性能对比

| 方面 | Viem | Wagmi |
|------|------|-------|
| 包大小 | 较小 | 较大(含React依赖) |
| 运行性能 | 略快 | 略慢(React开销) |
| 开发效率 | 中等 | 高 |
| 类型安全 | 高 | 非常高 |
| 错误处理 | 手动 | 自动 |

## 🎯 结论

**对于当前项目：**
- ✅ **继续使用双库架构**
- 🔵 **React层使用Wagmi** - 更好的开发体验
- 🟢 **服务层使用Viem** - 更好的性能和控制
- 📈 **逐步优化** - 根据具体需求调整

**完全替换的时机：**
- 当团队更熟悉单一库时
- 当包大小成为关键问题时
- 当维护成本超过收益时
