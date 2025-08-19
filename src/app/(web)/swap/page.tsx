'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowUpDown,
  Plus,
  Minus,
  DollarSign,
  Lock,
  Flame,
  Settings,
  Info,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';

interface Token {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  price: number;
  icon: string;
  change24h: number;
}

interface LiquidityPool {
  id: string;
  token0: Token;
  token1: Token;
  liquidity: number;
  volume24h: number;
  fees24h: number;
  apr: number;
  myLiquidity: number;
}

interface TradeData {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: number;
  toAmount: number;
  slippage: number;
  priceImpact: number;
}

export default function SwapPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('swap');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [pools, setPools] = useState<LiquidityPool[]>([]);
  const [tradeData, setTradeData] = useState<TradeData>({
    fromToken: null,
    toToken: null,
    fromAmount: 0,
    toAmount: 0,
    slippage: 0.5,
    priceImpact: 0
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'remove'>('add');

  // 初始化代币数据
  useEffect(() => {
    const mockTokens: Token[] = [
      {
        id: 'eth',
        symbol: 'ETH',
        name: 'Ethereum',
        balance: 5.2341,
        price: 2340.50,
        icon: '🔷',
        change24h: 2.45
      },
      {
        id: 'usdc',
        symbol: 'USDC',
        name: 'USD Coin',
        balance: 12450.00,
        price: 1.00,
        icon: '💵',
        change24h: 0.01
      },
      {
        id: 'rwa-nyc',
        symbol: 'NYC-RWA',
        name: '纽约房产代币',
        balance: 850.30,
        price: 125.80,
        icon: '🏢',
        change24h: 5.67
      },
      {
        id: 'rwa-london',
        symbol: 'LON-RWA',
        name: '伦敦房产代币',
        balance: 420.15,
        price: 89.25,
        icon: '🏛️',
        change24h: -1.23
      },
      {
        id: 'rwa-tokyo',
        symbol: 'TKY-RWA',
        name: '东京房产代币',
        balance: 1250.75,
        price: 67.40,
        icon: '🏯',
        change24h: 3.89
      }
    ];

    const mockPools: LiquidityPool[] = [
      {
        id: '1',
        token0: mockTokens[0], // ETH
        token1: mockTokens[1], // USDC
        liquidity: 1250000,
        volume24h: 89000,
        fees24h: 267,
        apr: 15.6,
        myLiquidity: 5430
      },
      {
        id: '2',
        token0: mockTokens[2], // NYC-RWA
        token1: mockTokens[1], // USDC
        liquidity: 850000,
        volume24h: 34000,
        fees24h: 102,
        apr: 22.3,
        myLiquidity: 2150
      },
      {
        id: '3',
        token0: mockTokens[3], // LON-RWA
        token1: mockTokens[0], // ETH
        liquidity: 420000,
        volume24h: 18000,
        fees24h: 54,
        apr: 18.9,
        myLiquidity: 0
      }
    ];

    setTokens(mockTokens);
    setPools(mockPools);
  }, []);

  const calculateSwap = (fromAmount: number, fromToken: Token, toToken: Token) => {
    if (!fromAmount || !fromToken || !toToken) return 0;
    
    // 简化的兑换计算（实际应该根据流动性池计算）
    const rate = fromToken.price / toToken.price;
    const fee = 0.003; // 0.3% 手续费
    const toAmount = fromAmount * rate * (1 - fee);
    
    return toAmount;
  };

  const handleSwap = async () => {
    if (!tradeData.fromToken || !tradeData.toToken || !tradeData.fromAmount) {
      toast({
        title: "输入错误",
        description: "请选择代币并输入金额",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // 模拟交易延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "交易成功",
        description: `成功交换 ${tradeData.fromAmount} ${tradeData.fromToken.symbol} 为 ${tradeData.toAmount.toFixed(6)} ${tradeData.toToken.symbol}`,
      });
      
      // 重置表单
      setTradeData(prev => ({
        ...prev,
        fromAmount: 0,
        toAmount: 0
      }));
    } catch (error) {
      toast({
        title: "交易失败",
        description: "交易过程中发生错误，请重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSwitch = () => {
    setTradeData(prev => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount
    }));
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  // 监听金额变化并计算兑换结果
  useEffect(() => {
    if (tradeData.fromToken && tradeData.toToken && tradeData.fromAmount > 0) {
      const toAmount = calculateSwap(tradeData.fromAmount, tradeData.fromToken, tradeData.toToken);
      const priceImpact = Math.random() * 0.5; // 模拟价格影响
      
      setTradeData(prev => ({
        ...prev,
        toAmount,
        priceImpact
      }));
    }
  }, [tradeData.fromAmount, tradeData.fromToken, tradeData.toToken]);

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="page-title">🔄 去中心化交易所</h1>
          <p className="page-subtitle">交换代币、提供流动性并赚取收益</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="themed-tabs-list grid w-full grid-cols-3">
            <TabsTrigger value="swap" className="themed-tabs-trigger">交换</TabsTrigger>
            <TabsTrigger value="pools" className="themed-tabs-trigger">流动性池</TabsTrigger>
            <TabsTrigger value="portfolio" className="themed-tabs-trigger">我的资产</TabsTrigger>
          </TabsList>

          {/* 交换标签页 */}
          <TabsContent value="swap">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 交换界面 */}
              <div className="lg:col-span-2">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-white">
                      <span className="flex items-center">
                        <ArrowUpDown className="w-5 h-5 mr-2 themed-icon" />
                        代币交换
          </span>
                      <Button variant="ghost" size="sm" className="themed-button-secondary">
                        <Settings className="w-4 h-4 themed-icon" />
          </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 发送代币 */}
                    <div className="space-y-2">
                      <Label className="themed-label">发送</Label>
                      <div className="flex space-x-2">
                        <div className="flex-1">
                    <Input
                            type="number"
                      placeholder="0.0"
                      value={tradeData.fromAmount || ''}
                            onChange={(e) => setTradeData(prev => ({ 
                              ...prev, 
                              fromAmount: Number(e.target.value) 
                            }))}
                            className="themed-input text-lg"
                          />
                        </div>
                    <Select
                      value={tradeData.fromToken?.id}
                          onValueChange={(value) => {
                            const token = tokens.find(t => t.id === value);
                            setTradeData(prev => ({ ...prev, fromToken: token || null }));
                          }}
                        >
                          <SelectTrigger className="themed-select-trigger w-32">
                            <SelectValue placeholder="选择" />
                          </SelectTrigger>
                          <SelectContent className="themed-select-content">
                            {tokens.map((token) => (
                              <SelectItem key={token.id} value={token.id} className="themed-select-item">
                                <div className="flex items-center">
                                  <span className="mr-2">{token.icon}</span>
                                  {token.symbol}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                    </Select>
                  </div>
                      {tradeData.fromToken && (
                        <p className="text-sm text-gray-400">
                          余额: {formatNumber(tradeData.fromToken.balance)} {tradeData.fromToken.symbol}
                        </p>
                      )}
                </div>

                    {/* 交换按钮 */}
                    <div className="flex justify-center">
                  <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleTokenSwitch}
                        className="themed-button-secondary rounded-full p-2"
                      >
                        <ArrowUpDown className="w-4 h-4 themed-icon" />
                      </Button>
                </div>

                    {/* 接收代币 */}
                    <div className="space-y-2">
                      <Label className="themed-label">接收</Label>
                      <div className="flex space-x-2">
                        <div className="flex-1">
                    <Input
                            type="number"
                      placeholder="0.0"
                            value={tradeData.toAmount || ''}
                            readOnly
                            className="themed-input text-lg"
                          />
                        </div>
                    <Select
                      value={tradeData.toToken?.id}
                          onValueChange={(value) => {
                            const token = tokens.find(t => t.id === value);
                            setTradeData(prev => ({ ...prev, toToken: token || null }));
                          }}
                        >
                          <SelectTrigger className="themed-select-trigger w-32">
                            <SelectValue placeholder="选择" />
                          </SelectTrigger>
                          <SelectContent className="themed-select-content">
                            {tokens.map((token) => (
                              <SelectItem key={token.id} value={token.id} className="themed-select-item">
                                <div className="flex items-center">
                                  <span className="mr-2">{token.icon}</span>
                                  {token.symbol}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                    </Select>
                  </div>
                      {tradeData.toToken && (
                        <p className="text-sm text-gray-400">
                          余额: {formatNumber(tradeData.toToken.balance)} {tradeData.toToken.symbol}
                        </p>
                      )}
                </div>

                    {/* 交易信息 */}
                {tradeData.fromToken && tradeData.toToken && tradeData.fromAmount > 0 && (
                      <div className="glass-card p-3 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm text-gray-300">
                          <span>汇率</span>
                          <span>
                            1 {tradeData.fromToken.symbol} ≈ {formatNumber(tradeData.fromToken.price / tradeData.toToken.price)} {tradeData.toToken.symbol}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-300">
                          <span>价格影响</span>
                          <span className={tradeData.priceImpact > 1 ? 'text-orange-400' : 'text-green-400'}>
                            {tradeData.priceImpact.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-300">
                          <span>手续费</span>
                          <span>0.3%</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-300">
                          <span>滑点容忍度</span>
                          <span>{tradeData.slippage}%</span>
                        </div>
                      </div>
                    )}

                    {/* 交换按钮 */}
                <Button
                  onClick={handleSwap}
                      disabled={loading || !tradeData.fromToken || !tradeData.toToken || !tradeData.fromAmount}
                      className="themed-button-primary w-full"
                      size="lg"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin themed-loading" />
                      ) : (
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                      )}
                      {loading ? '交换中...' : '交换'}
                </Button>
                  </CardContent>
            </Card>
              </div>

              {/* 市场统计 */}
              <div className="space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">市场概览</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {tokens.slice(0, 5).map((token) => (
                      <div key={token.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2 text-lg">{token.icon}</span>
                      <div>
                            <p className="font-medium text-white">{token.symbol}</p>
                            <p className="text-sm text-gray-400">{formatCurrency(token.price)}</p>
                          </div>
                      </div>
                    <div className="text-right">
                          <div className={`flex items-center ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {token.change24h >= 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            <span className="text-sm">{Math.abs(token.change24h).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">热门交易对</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pools.slice(0, 3).map((pool) => (
                        <div key={pool.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="mr-1">{pool.token0.icon}</span>
                            <span className="mr-1">{pool.token1.icon}</span>
                            <span className="text-sm font-medium text-white">
                              {pool.token0.symbol}/{pool.token1.symbol}
                            </span>
                          </div>
                          <Badge className="themed-badge">
                            {pool.apr.toFixed(1)}% APR
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
            </Card>
              </div>
            </div>
          </TabsContent>

          {/* 流动性池标签页 */}
          <TabsContent value="pools">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">流动性池</h2>
                <Button onClick={() => { setModalType('add'); setModalVisible(true); }} className="themed-button-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  添加流动性
                </Button>
              </div>

              <Card className="glass-card">
                <Table className="themed-table">
                  <TableHeader>
                    <TableRow className="themed-table-header">
                      <TableHead className="themed-table-cell">交易对</TableHead>
                      <TableHead className="themed-table-cell">总流动性</TableHead>
                      <TableHead className="themed-table-cell">24h交易量</TableHead>
                      <TableHead className="themed-table-cell">24h手续费</TableHead>
                      <TableHead className="themed-table-cell">APR</TableHead>
                      <TableHead className="themed-table-cell">我的流动性</TableHead>
                      <TableHead className="themed-table-cell"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pools.map((pool) => (
                      <TableRow key={pool.id} className="themed-table-row">
                        <TableCell className="themed-table-cell">
                          <div className="flex items-center">
                            <span className="mr-1">{pool.token0.icon}</span>
                            <span className="mr-1">{pool.token1.icon}</span>
                            <span className="font-medium">
                              {pool.token0.symbol}/{pool.token1.symbol}
        </span>
                          </div>
                        </TableCell>
                        <TableCell className="themed-table-cell">{formatCurrency(pool.liquidity)}</TableCell>
                        <TableCell className="themed-table-cell">{formatCurrency(pool.volume24h)}</TableCell>
                        <TableCell className="themed-table-cell">{formatCurrency(pool.fees24h)}</TableCell>
                        <TableCell className="themed-table-cell">
                          <Badge className="themed-badge">
                            {pool.apr.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="themed-table-cell">
                          {pool.myLiquidity > 0 ? formatCurrency(pool.myLiquidity) : '-'}
                        </TableCell>
                        <TableCell className="themed-table-cell">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="themed-button-secondary"
                              onClick={() => { setModalType('add'); setModalVisible(true); }}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            {pool.myLiquidity > 0 && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="themed-button-secondary"
                                onClick={() => { setModalType('remove'); setModalVisible(true); }}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>

          {/* 我的资产标签页 */}
          <TabsContent value="portfolio">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">我的资产</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">总资产价值</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(tokens.reduce((sum, token) => sum + (token.balance * token.price), 0))}
                    </p>
                    <p className="text-sm text-green-400 mt-2">
                      <TrendingUp className="w-3 h-3 inline mr-1 themed-icon-success" />
                      +5.67% (24h)
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">流动性收益</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(pools.reduce((sum, pool) => sum + pool.myLiquidity, 0))}
                    </p>
                    <p className="text-sm text-green-400 mt-2">
                      <DollarSign className="w-3 h-3 inline mr-1 themed-icon-success" />
                      {formatCurrency(pools.reduce((sum, pool) => sum + (pool.myLiquidity * pool.apr / 365 / 100), 0))} 日收益
                    </p>
                  </CardContent>
              </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">平均APR</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-white">
                      {(pools.reduce((sum, pool) => sum + pool.apr, 0) / pools.length).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      <Flame className="w-3 h-3 inline mr-1 themed-icon" />
                      流动性挖矿收益率
                    </p>
                  </CardContent>
              </Card>
              </div>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">代币余额</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table className="themed-table">
                    <TableHeader>
                      <TableRow className="themed-table-header">
                        <TableHead className="themed-table-cell">代币</TableHead>
                        <TableHead className="themed-table-cell">余额</TableHead>
                        <TableHead className="themed-table-cell">价格</TableHead>
                        <TableHead className="themed-table-cell">价值</TableHead>
                        <TableHead className="themed-table-cell">24h变化</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tokens.map((token) => (
                        <TableRow key={token.id} className="themed-table-row">
                          <TableCell className="themed-table-cell">
                            <div className="flex items-center">
                              <span className="mr-2 text-lg">{token.icon}</span>
                              <div>
                                <p className="font-medium text-white">{token.symbol}</p>
                                <p className="text-sm text-gray-400">{token.name}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="themed-table-cell">{formatNumber(token.balance)}</TableCell>
                          <TableCell className="themed-table-cell">{formatCurrency(token.price)}</TableCell>
                          <TableCell className="themed-table-cell">{formatCurrency(token.balance * token.price)}</TableCell>
                          <TableCell className="themed-table-cell">
                            <div className={`flex items-center ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {token.change24h >= 0 ? (
                                <TrendingUp className="w-3 h-3 mr-1" />
                              ) : (
                                <TrendingDown className="w-3 h-3 mr-1" />
                              )}
                              <span>{Math.abs(token.change24h).toFixed(2)}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* 流动性对话框 */}
        <Dialog open={modalVisible} onOpenChange={setModalVisible}>
          <DialogContent className="themed-dialog-content">
            <DialogHeader>
              <DialogTitle className="themed-dialog-title">
                {modalType === 'add' ? '添加流动性' : '移除流动性'}
              </DialogTitle>
              <DialogDescription className="themed-dialog-description">
                {modalType === 'add' ? '向流动性池添加代币以赚取手续费收益' : '从流动性池移除代币'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Alert className="themed-alert-info">
                <Info className="h-4 w-4 themed-icon" />
                <AlertDescription>
                  {modalType === 'add' 
                    ? '添加流动性将获得LP代币，并可获得交易手续费分成'
                    : '移除流动性将销毁LP代币，并停止获得手续费收益'
                  }
                </AlertDescription>
              </Alert>
              {/* 这里可以添加具体的流动性操作表单 */}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalVisible(false)} className="themed-button-secondary">
                取消
              </Button>
              <Button onClick={() => setModalVisible(false)} className="themed-button-primary">
                确认{modalType === 'add' ? '添加' : '移除'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
