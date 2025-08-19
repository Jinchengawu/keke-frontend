'use client'

import React, { useState } from 'react'
import { Button, Dropdown, Space } from 'antd'
import { DownOutlined, GlobalOutlined, MenuOutlined, LogoutOutlined, WalletOutlined, CopyOutlined } from '@ant-design/icons'
import { useWeb3 } from '@/hooks/useWeb3'
import Link from 'next/link'
import './index.css'

const Head: React.FC = () => {
  const { address, isConnected, isConnecting, connectWallet, disconnect } = useWeb3()
  const [currentLang, setCurrentLang] = useState('繁體中文')

  // 语言选项
  const languageItems = [
    {
      key: 'zh-TW',
      label: '繁體中文',
    },
    {
      key: 'zh-CN',
      label: '简体中文',
    },
    {
      key: 'en',
      label: 'English',
    },
  ]

  // 导航菜单项
  const navItems = [
    { key: 'marketplace', label: '交易', href: '/swap' },
    { key: 'mint', label: '铸造', href: '/mint' },
    { key: 'ranking', label: '赎回', href: '/redeem' },
    { key: 'advanced', label: '农场', href: '/' },
    { key: 'create', label: '创建代币', href: '/create-token' },
    ]

  // 处理语言切换
  const handleLanguageChange = ({ key }: { key: string }) => {
    const lang = languageItems.find(item => item.key === key)
    if (lang) {
      setCurrentLang(lang.label)
    }
  }

  // 格式化地址显示
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // 复制地址到剪贴板
  const handleCopyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address)
        // 可以添加成功提示
        console.log('地址已复制到剪贴板')
      } catch (error) {
        console.error('复制失败:', error)
      }
    }
  }

  // 断开钱包连接
  const handleDisconnect = () => {
    disconnect()
  }

  // 钱包菜单项
  const walletMenuItems = [
    {
      key: 'address',
      label: (
        <div className="flex items-center space-x-2 py-1">
          <WalletOutlined />
          <span className="text-gray-600 text-sm">{address}</span>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'copy',
      label: (
        <div className="flex items-center space-x-2">
          <CopyOutlined />
          <span>复制地址</span>
        </div>
      ),
      onClick: handleCopyAddress,
    },
    {
      key: 'disconnect',
      label: (
        <div className="flex items-center space-x-2 text-red-500">
          <LogoutOutlined />
          <span>断开连接</span>
        </div>
      ),
      onClick: handleDisconnect,
    },
  ]

  return (
    <header className="head-container h-16 w100 flex items-center justify-between px-6">
      {/* 左侧：Logo + 导航菜单 */}
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <div className="logo-container flex items-center space-x-2 cursor-pointer">
          <div className="logo-icon w-8 h-8 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="logo-text text-white font-bold text-xl">FOUR</span>
        </div>

        {/* 导航菜单 - 桌面版 */}
        <nav className="nav-menu hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="nav-item text-gray-300 hover:text-white text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 移动端菜单按钮 */}
        <Button
          type="text"
          icon={<MenuOutlined />}
          className="mobile-menu-button md:hidden"
        />
      </div>

      {/* 右侧：语言选择 + 连接钱包按钮 */}
      <div className="flex items-center space-x-4">
        {/* 语言选择 */}
        <Dropdown
          menu={{
            items: languageItems,
            onClick: handleLanguageChange,
          }}
          trigger={['click']}
        >
          <Button
            type="text"
            className="language-dropdown text-gray-300 hover:text-white border-none bg-transparent"
            icon={<GlobalOutlined />}
          >
            <Space>
              <span className="hidden sm:inline">{currentLang}</span>
              <DownOutlined className="text-xs" />
            </Space>
          </Button>
        </Dropdown>

        {/* 连接钱包按钮/菜单 */}
        <div className="relative">
          {!isConnected ? (
            // 未连接状态：显示连接按钮
            <Button
              type="primary"
              size="middle"
              loading={isConnecting}
              onClick={connectWallet}
              className="wallet-button border-none rounded-lg px-6 font-medium"
              style={{
                background: 'linear-gradient(90deg, #059669 0%, #2563eb 100%)',
              }}
            >
              连接钱包
            </Button>
          ) : (
            // 已连接状态：显示下拉菜单
            <Dropdown
              menu={{
                items: walletMenuItems,
              }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button
                type="primary"
                size="middle"
                className="wallet-button border-none rounded-lg px-6 font-medium"
                style={{
                  background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
                }}
              >
                <Space>
                  {formatAddress(address || '')}
                  <DownOutlined className="text-xs" />
                </Space>
              </Button>
            </Dropdown>
          )}
          
          {/* 连接状态指示器 */}
          {isConnected && (
            <div className="connection-indicator"></div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Head
