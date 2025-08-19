'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { 
  ChevronDown, 
  Globe, 
  Menu, 
  LogOut, 
  Wallet, 
  Copy,
  Twitter,
  ExternalLink
} from 'lucide-react'
import { useWeb3 } from '@/hooks/useWeb3'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import './index.css'

const Head: React.FC = () => {
  const { address, isConnected, isConnecting, connectWallet, disconnect } = useWeb3()
  const [currentLang, setCurrentLang] = useState('繁體中文')
  const { toast } = useToast()

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
  const handleLanguageChange = (key: string) => {
    const lang = languageItems.find(item => item.key === key)
    if (lang) {
      setCurrentLang(lang.label)
    }
  }

  // 格式化地址显示
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // 复制地址
  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address)
        toast({
          title: "地址已复制",
          description: "钱包地址已复制到剪贴板",
        })
      } catch (err) {
        console.error('Failed to copy address:', err)
        toast({
          title: "复制失败",
          description: "无法复制地址到剪贴板",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <header className="head-container h-16 w100 flex items-center justify-between px-6">
      {/* 左侧：Logo + 导航菜单 */}
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <div className="logo-container flex items-center space-x-2 cursor-pointer">
          <div className="logo-icon w-8 h-8 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🏠</span>
          </div>
          <Link href="/" className="logo-text text-white font-bold text-xl">
            RenToken.World
          </Link>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="mobile-menu-button md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {navItems.map((item) => (
              <DropdownMenuItem key={item.key} asChild>
                <Link href={item.href}>
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 右侧：语言选择 + 连接钱包按钮 */}
      <div className="flex items-center space-x-4">
        {/* 语言选择 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="language-dropdown text-gray-300 hover:text-white border-none bg-transparent"
            >
              <Globe className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{currentLang}</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {languageItems.map((item) => (
              <DropdownMenuItem
                key={item.key}
                onClick={() => handleLanguageChange(item.key)}
                className={cn(
                  currentLang === item.label && "bg-accent"
                )}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 连接钱包按钮/菜单 */}
        <div className="relative">
          {!isConnected ? (
            // 未连接状态：显示连接按钮
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="wallet-button border-none rounded-lg px-6 font-medium"
              style={{
                background: 'linear-gradient(90deg, #059669 0%, #2563eb 100%)',
              }}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isConnecting ? '连接中...' : '连接钱包'}
            </Button>
          ) : (
            // 已连接状态：显示下拉菜单
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="wallet-button border-none rounded-lg px-6 font-medium"
                    style={{
                      background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
                    }}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    <span>{formatAddress(address || '')}</span>
                    <ChevronDown className="w-3 h-3 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={copyAddress}>
                    <Copy className="w-4 h-4 mr-2" />
                    复制地址
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => disconnect()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    断开连接
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* 连接状态指示器 */}
              <div className="connection-indicator"></div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Head
