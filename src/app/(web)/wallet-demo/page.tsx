'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/hooks/useWeb3';
import { 
  Wallet,
  Copy,
  Send,
  ArrowUpDown,
  RefreshCw,
  Shield,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface TokenBalance {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  icon: string;
}

export default function WalletDemoPage() {
  const { toast } = useToast();
  const { address, isConnected, connectWallet, disconnect } = useWeb3();
  
  const [loading, setLoading] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [selectedToken, setSelectedToken] = useState<TokenBalance | null>(null);

  const [tokenBalances] = useState<TokenBalance[]>([
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 2.5431,
      value: 5950.75,
      icon: '🔷'
    },
    {
      symbol: 'BNB',
      name: 'BNB',
      balance: 8.2156,
      value: 2465.23,
      icon: '🟡'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: 1250.00,
      value: 1250.00,
      icon: '💵'
    },
    {
      symbol: 'NYC-RWA',
      name: '纽约房产代币',
      balance: 850.30,
      value: 10698.27,
      icon: '🏢'
    }
  ]);

  const totalBalance = tokenBalances.reduce((sum, token) => sum + token.value, 0);

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number, decimals: number = 4) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        toast({
          title: "地址已复制",
          description: "钱包地址已复制到剪贴板",
        });
      } catch (err) {
        toast({
          title: "复制失败",
          description: "无法复制地址到剪贴板",
          variant: "destructive",
        });
      }
    }
  };

  const handleSendToken = (token: TokenBalance) => {
    setSelectedToken(token);
    setSendAmount('');
    setSendAddress('');
    setSendModalOpen(true);
  };

  const handleConfirmSend = async () => {
    if (!selectedToken || !sendAmount || !sendAddress) {
      toast({
        title: "参数错误",
        description: "请填写完整的发送信息",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(sendAmount);
    if (amount <= 0 || amount > selectedToken.balance) {
      toast({
        title: "金额错误",
        description: "发送金额必须大于0且不能超过余额",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // 模拟发送交易
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "发送成功",
        description: `成功发送 ${amount} ${selectedToken.symbol} 到 ${formatAddress(sendAddress)}`,
      });
      
      setSendModalOpen(false);
      setSelectedToken(null);
      setSendAmount('');
      setSendAddress('');
    } catch (error) {
      toast({
        title: "发送失败",
        description: "交易发送失败，请重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshBalances = async () => {
    setLoading(true);
    try {
      // 模拟刷新余额
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "余额已更新",
        description: "钱包余额已刷新",
      });
    } catch (error) {
      toast({
        title: "刷新失败",
        description: "无法刷新余额，请重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle>连接钱包</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              请连接您的钱包以查看余额和进行交易
            </p>
            <Button onClick={connectWallet} className="w-full">
              <Wallet className="w-4 h-4 mr-2" />
              连接钱包
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">钱包管理</h1>
          <p className="text-gray-600">管理您的数字资产和进行交易</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主要内容区 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 钱包概览 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Wallet className="w-5 h-5 mr-2" />
                    钱包概览
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRefreshBalances}
                      disabled={loading}
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => disconnect()}>
                      断开连接
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 钱包地址 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">钱包地址</p>
                        <p className="font-mono text-sm">{formatAddress(address)}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={copyAddress}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* 总资产价值 */}
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-500 mb-2">总资产价值</p>
                    <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
                    <p className="text-sm text-green-600 mt-2">
                      <span className="inline-flex items-center">
                        📈 +5.67% (24h)
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 代币余额 */}
            <Card>
              <CardHeader>
                <CardTitle>代币余额</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tokenBalances.map((token, index) => (
                    <div key={token.symbol}>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{token.icon}</span>
                          <div>
                            <p className="font-medium">{token.symbol}</p>
                            <p className="text-sm text-gray-500">{token.name}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-medium">{formatNumber(token.balance)}</p>
                          <p className="text-sm text-gray-500">{formatCurrency(token.value)}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSendToken(token)}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <ArrowUpDown className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 快速操作 */}
            <Card>
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Send className="w-4 h-4 mr-2" />
                  发送代币
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  交换代币
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  查看交易记录
                </Button>
              </CardContent>
            </Card>

            {/* 安全提示 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  安全提示
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    ✅ 钱包已连接并受到保护
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    💡 始终确认交易详情再签名
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    🔒 妥善保管您的私钥和助记词
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* 网络状态 */}
            <Card>
              <CardHeader>
                <CardTitle>网络状态</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">当前网络</span>
                  <Badge variant="default">BSC 测试网</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">连接状态</span>
                  <Badge variant="secondary" className="text-green-600">
                    ✅ 已连接
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Gas 费用</span>
                  <span className="text-sm font-medium">5 Gwei</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 发送代币对话框 */}
        <Dialog open={sendModalOpen} onOpenChange={setSendModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>发送代币</DialogTitle>
              <DialogDescription>
                {selectedToken && `发送 ${selectedToken.name} (${selectedToken.symbol})`}
              </DialogDescription>
            </DialogHeader>
            
            {selectedToken && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{selectedToken.icon}</span>
                    <div>
                      <p className="font-medium">{selectedToken.symbol}</p>
                      <p className="text-sm text-gray-500">
                        余额: {formatNumber(selectedToken.balance)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="sendAddress">接收地址</Label>
                  <Input
                    id="sendAddress"
                    placeholder="输入接收地址"
                    value={sendAddress}
                    onChange={(e) => setSendAddress(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="sendAmount">发送数量</Label>
                  <Input
                    id="sendAmount"
                    type="number"
                    placeholder="输入发送数量"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    max={selectedToken.balance}
                    className="mt-1"
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>可用: {formatNumber(selectedToken.balance)}</span>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-auto p-0 text-xs"
                      onClick={() => setSendAmount(selectedToken.balance.toString())}
                    >
                      全部
                    </Button>
                  </div>
                </div>

                {sendAmount && parseFloat(sendAmount) > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>发送数量</span>
                      <span>{sendAmount} {selectedToken.symbol}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>预估费用</span>
                      <span>~0.001 BNB</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>总计</span>
                      <span>{formatCurrency(parseFloat(sendAmount) * (selectedToken.value / selectedToken.balance))}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSendModalOpen(false)}>
                取消
              </Button>
              <Button 
                onClick={handleConfirmSend}
                disabled={loading || !sendAmount || !sendAddress}
              >
                {loading ? '发送中...' : '确认发送'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
