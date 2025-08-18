/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-18 15:00:00
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-18 15:00:00
 * @FilePath: /keke-frontend/src/components/WalletConnect/index.tsx
 * @Description: 钱包连接组件，使用wagmi hooks实现
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */

'use client'

import { Button, message, Tooltip } from 'antd'
import { WalletOutlined, DisconnectOutlined, LoginOutlined } from '@ant-design/icons'
import { useWeb3 } from '@/hooks/useWeb3'
import { useState } from 'react'

interface WalletConnectProps {
  showAuth?: boolean // 是否显示认证按钮
  size?: 'small' | 'middle' | 'large'
}

/**
 * 钱包连接组件
 * 提供连接钱包、断开连接和认证功能
 */
export default function WalletConnect({ showAuth = false, size = 'middle' }: WalletConnectProps) {
  const {
    address,
    isConnected,
    isConnecting,
    connectWallet,
    disconnect,
    doLogin,
    isWalletConnected,
  } = useWeb3()

  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // 处理钱包连接
  const handleConnect = async () => {
    try {
      await connectWallet()
      message.success('钱包连接成功!')
    } catch (error) {
      console.error('钱包连接失败:', error)
      message.error('钱包连接失败，请重试')
    }
  }

  // 处理钱包断开
  const handleDisconnect = () => {
    try {
      disconnect()
      localStorage.removeItem('token') // 清除认证token
      message.success('钱包已断开连接')
    } catch (error) {
      console.error('断开连接失败:', error)
      message.error('断开连接失败')
    }
  }

  // 处理认证
  const handleAuth = async () => {
    if (!isWalletConnected) {
      message.warning('请先连接钱包')
      return
    }

    setIsAuthenticating(true)
    try {
      const jwt = await doLogin()
      if (jwt) {
        message.success('认证成功!')
        console.log('JWT:', jwt)
      }
    } catch (error) {
      console.error('认证失败:', error)
      message.error('认证失败，请重试')
    } finally {
      setIsAuthenticating(false)
    }
  }

  // 格式化地址显示
  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <Tooltip title={`钱包地址: ${address}`}>
          <Button
            type="default"
            icon={<WalletOutlined />}
            size={size}
            className="bg-green-50 border-green-200 text-green-700"
          >
            {formatAddress(address)}
          </Button>
        </Tooltip>
        
        {showAuth && (
          <Button
            type="primary"
            icon={<LoginOutlined />}
            size={size}
            loading={isAuthenticating}
            onClick={handleAuth}
          >
            认证
          </Button>
        )}
        
        <Button
          type="default"
          icon={<DisconnectOutlined />}
          size={size}
          onClick={handleDisconnect}
          danger
        >
          断开
        </Button>
      </div>
    )
  }

  return (
    <Button
      type="primary"
      icon={<WalletOutlined />}
      size={size}
      loading={isConnecting}
      onClick={handleConnect}
    >
      连接钱包
    </Button>
  )
}
