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
    <header className="header-container">
      <div className="header-content">
        {/* Logo */}
        <div className="logo-section">
          <Link href="/" className="flex items-center space-x-2">
            <div className="logo-icon">🏠</div>
            <div className="logo-text">
              <div className="logo-title">RenToken</div>
              <div className="logo-subtitle">房租收益RWA平台</div>
            </div>
          </Link>
        </div>

        {/* 桌面端导航 */}
        <nav className="desktop-nav">
          <div className="nav-links">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="nav-link"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* 右侧操作区 */}
        <div className="header-actions">
          {/* 语言切换 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="language-dropdown">
                <Globe className="w-4 h-4" />
                <span className="hidden md:inline">{currentLang}</span>
                <ChevronDown className="w-3 h-3" />
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

          {/* 钱包连接 */}
          {!isConnected ? (
            <Button 
              onClick={connectWallet}
              disabled={isConnecting}
              className="connect-wallet-btn"
            >
              <Wallet className="w-4 h-4" />
              {isConnecting ? '连接中...' : '连接钱包'}
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="wallet-dropdown">
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {formatAddress(address || '')}
                  </span>
                  <ChevronDown className="w-3 h-3" />
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
          )}

          {/* 移动端菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="mobile-menu-btn md:hidden">
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
      </div>

      {/* 页面标识和社交链接 */}
      <div className="header-footer">
        <div className="page-info">
          <span className="page-badge">
            🚀 房产租金收益数字化平台
          </span>
        </div>
        
        <div className="social-links">
          <Button variant="ghost" size="sm" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Twitter className="w-4 h-4" />
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Head
