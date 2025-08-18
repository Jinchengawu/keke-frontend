/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-18 15:00:00
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-18 15:00:00
 * @FilePath: /keke-frontend/src/app/(web)/wallet-demo/page.tsx
 * @Description: 钱包功能演示页面，展示新的wagmi hooks的使用
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

'use client'

import { Card, Space, Typography, Divider, Alert } from 'antd'
import WalletConnect from '@/components/WalletConnect'
import { useWeb3 } from '@/hooks/useWeb3'

const { Title, Paragraph, Text } = Typography

/**
 * 钱包功能演示页面
 * 展示新的Viem.js + Wagmi重构后的Web3功能
 */
export default function WalletDemoPage() {
  const { address, isConnected } = useWeb3()

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Title level={2}>🚀 Web3 功能演示</Title>
      <Paragraph type="secondary">
        展示使用 Viem.js 和 Wagmi 重构后的 Web3 功能
      </Paragraph>

      <Alert
        message="重构完成！"
        description="已成功将 ethers.js 迁移到 Viem.js + Wagmi，提供更现代化和类型安全的 Web3 开发体验。"
        type="success"
        style={{ marginBottom: 24 }}
      />

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 钱包连接区域 */}
        <Card title="🔗 钱包连接" size="default">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Paragraph>
              使用新的 <Text code>useWeb3</Text> Hook 连接和管理钱包状态：
            </Paragraph>
            <WalletConnect showAuth={true} size="large" />
            {isConnected && address && (
              <Alert
                message="钱包已连接"
                description={`当前连接地址: ${address}`}
                type="info"
                showIcon
              />
            )}
          </Space>
        </Card>

        {/* 技术特性 */}
        <Card title="✨ 技术特性" size="default">
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Title level={4}>主要改进：</Title>
            <ul>
              <li><Text strong>Viem.js:</Text> 更现代化的以太坊库，提供更好的类型安全和性能</li>
              <li><Text strong>Wagmi:</Text> React hooks for Ethereum，简化Web3状态管理</li>
              <li><Text strong>TypeScript:</Text> 完整的类型支持，减少运行时错误</li>
              <li><Text strong>模块化:</Text> 更好的代码组织和可维护性</li>
            </ul>

            <Divider />

            <Title level={4}>新的 Hooks：</Title>
            <ul>
              <li><Text code>useWalletConnection()</Text> - 钱包连接管理</li>
              <li><Text code>useWeb3Auth()</Text> - Web3 认证流程</li>
              <li><Text code>useERC20()</Text> - ERC20 代币交互</li>
              <li><Text code>useWeb3()</Text> - 综合 Web3 功能</li>
            </ul>

            <Divider />

            <Title level={4}>重构文件：</Title>
            <ul>
              <li><Text code>src/lib/wagmi.ts</Text> - Wagmi 配置</li>
              <li><Text code>src/components/WagmiProvider.tsx</Text> - Provider 组件</li>
              <li><Text code>src/services/web3service.ts</Text> - Web3 服务 (Viem)</li>
              <li><Text code>src/hooks/useWeb3.ts</Text> - 自定义 Hooks</li>
              <li><Text code>src/components/WalletConnect/</Text> - 钱包连接组件</li>
            </ul>
          </Space>
        </Card>

        {/* 使用示例 */}
        <Card title="💻 代码示例" size="default">
          <Typography.Text>
            <pre style={{ background: '#f6f8fa', padding: '16px', borderRadius: '6px', overflow: 'auto' }}>
{`// 使用新的 hooks
import { useWeb3 } from '@/hooks/useWeb3'

function MyComponent() {
  const { 
    address, 
    isConnected, 
    connectWallet, 
    doLogin, 
    approveToken 
  } = useWeb3()

  return (
    <div>
      {isConnected ? (
        <p>Connected: {address}</p>
      ) : (
        <button onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  )
}`}
            </pre>
          </Typography.Text>
        </Card>
      </Space>
    </div>
  )
}
