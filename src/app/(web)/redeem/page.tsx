'use client';

import { useState } from 'react';
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
  DollarSign,
  Home,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Calendar,
  TrendingDown,
  ArrowRight
} from 'lucide-react';

interface RedeemableAsset {
  id: string;
  tokenSymbol: string;
  tokenName: string;
  balance: number;
  lockedAmount: number;
  availableAmount: number;
  underlyingAsset: string;
  redemptionRatio: number; // 1 token = X USD of underlying asset
  lockEndDate: Date;
  penaltyRate: number; // Early withdrawal penalty
  isLocked: boolean;
}

interface RedemptionRequest {
  id: string;
  assetId: string;
  amount: number;
  estimatedValue: number;
  requestDate: Date;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  isEarlyWithdrawal: boolean;
  penaltyAmount: number;
}

export default function RedeemPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('assets');
  const [loading, setLoading] = useState(false);
  const [redeemModalOpen, setRedeemModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<RedeemableAsset | null>(null);
  const [redeemAmount, setRedeemAmount] = useState(0);

  const [redeemableAssets] = useState<RedeemableAsset[]>([
    {
      id: 'nyc-rwa-1',
      tokenSymbol: 'NYC-RWA',
      tokenName: '纽约房产代币',
      balance: 850.30,
      lockedAmount: 650.30,
      availableAmount: 200.00,
      underlyingAsset: '曼哈顿豪华公寓',
      redemptionRatio: 125.80, // 1 token = $125.80
      lockEndDate: new Date('2024-06-15'),
      penaltyRate: 0.05, // 5% penalty for early withdrawal
      isLocked: true
    },
    {
      id: 'london-rwa-1',
      tokenSymbol: 'LON-RWA',
      tokenName: '伦敦房产代币',
      balance: 420.15,
      lockedAmount: 0,
      availableAmount: 420.15,
      underlyingAsset: '肯辛顿传统别墅',
      redemptionRatio: 89.25,
      lockEndDate: new Date('2024-01-20'),
      penaltyRate: 0.03,
      isLocked: false
    },
    {
      id: 'tokyo-rwa-1',
      tokenSymbol: 'TKY-RWA',
      tokenName: '东京房产代币',
      balance: 1250.75,
      lockedAmount: 800.00,
      availableAmount: 450.75,
      underlyingAsset: '涩谷商业大厦',
      redemptionRatio: 67.40,
      lockEndDate: new Date('2024-09-30'),
      penaltyRate: 0.04,
      isLocked: true
    }
  ]);

  const [redemptionHistory] = useState<RedemptionRequest[]>([
    {
      id: 'redeem-001',
      assetId: 'london-rwa-1',
      amount: 50,
      estimatedValue: 4462.50,
      requestDate: new Date('2024-01-15'),
      status: 'completed',
      isEarlyWithdrawal: false,
      penaltyAmount: 0
    },
    {
      id: 'redeem-002',
      assetId: 'nyc-rwa-1',
      amount: 25,
      estimatedValue: 3145.00,
      requestDate: new Date('2024-01-10'),
      status: 'processing',
      isEarlyWithdrawal: true,
      penaltyAmount: 157.25
    }
  ]);

  const handleRedeemRequest = (asset: RedeemableAsset) => {
    setSelectedAsset(asset);
    setRedeemAmount(0);
    setRedeemModalOpen(true);
  };

  const calculateRedemptionValue = (asset: RedeemableAsset, amount: number) => {
    const baseValue = amount * asset.redemptionRatio;
    const isEarlyWithdrawal = asset.isLocked && new Date() < asset.lockEndDate;
    const penalty = isEarlyWithdrawal ? baseValue * asset.penaltyRate : 0;
    return {
      baseValue,
      penalty,
      netValue: baseValue - penalty,
      isEarlyWithdrawal
    };
  };

  const handleConfirmRedemption = async () => {
    if (!selectedAsset || !redeemAmount) {
      toast({
        title: "参数错误",
        description: "请选择资产并输入赎回数量",
        variant: "destructive",
      });
      return;
    }

    if (redeemAmount > selectedAsset.availableAmount) {
      toast({
        title: "数量超限",
        description: "赎回数量不能超过可用余额",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // 模拟赎回流程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { netValue, isEarlyWithdrawal, penalty } = calculateRedemptionValue(selectedAsset, redeemAmount);
      
      toast({
        title: "赎回请求已提交",
        description: `将获得 $${netValue.toFixed(2)}${isEarlyWithdrawal ? ` (扣除 $${penalty.toFixed(2)} 提前赎回费用)` : ''}`,
      });
      
      setRedeemModalOpen(false);
      setSelectedAsset(null);
      setRedeemAmount(0);
    } catch (error) {
      toast({
        title: "赎回失败",
        description: "提交赎回请求时发生错误，请重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: '待处理' },
      processing: { variant: 'default' as const, label: '处理中' },
      completed: { variant: 'secondary' as const, label: '已完成' },
      cancelled: { variant: 'destructive' as const, label: '已取消' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">代币赎回</h1>
          <p className="text-gray-600">赎回您的房产代币，获取对应的底层资产价值</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assets">我的资产</TabsTrigger>
            <TabsTrigger value="history">赎回历史</TabsTrigger>
            <TabsTrigger value="stats">收益统计</TabsTrigger>
          </TabsList>

          {/* 我的资产标签页 */}
          <TabsContent value="assets">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">总资产价值</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {formatCurrency(
                        redeemableAssets.reduce((sum, asset) => 
                          sum + (asset.balance * asset.redemptionRatio), 0
                        )
                      )}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">包含所有房产代币价值</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">可赎回价值</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(
                        redeemableAssets.reduce((sum, asset) => 
                          sum + (asset.availableAmount * asset.redemptionRatio), 0
                        )
                      )}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">可立即赎回的价值</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">锁定资产</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(
                        redeemableAssets.reduce((sum, asset) => 
                          sum + (asset.lockedAmount * asset.redemptionRatio), 0
                        )
                      )}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">尚在锁定期的资产</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>资产列表</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {redeemableAssets.map((asset) => (
                      <Card key={asset.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <Home className="w-5 h-5 mr-2 text-blue-600" />
                              <h3 className="font-semibold">{asset.tokenName}</h3>
                              <Badge variant="outline" className="ml-2">
                                {asset.tokenSymbol}
                              </Badge>
                              {asset.isLocked && (
                                <Badge variant="secondary" className="ml-2">
                                  <Lock className="w-3 h-3 mr-1" />
                                  锁定中
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-gray-600 mb-4">{asset.underlyingAsset}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">总余额</p>
                                <p className="font-medium">{asset.balance.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">可赎回</p>
                                <p className="font-medium text-green-600">{asset.availableAmount.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">锁定数量</p>
                                <p className="font-medium text-orange-600">{asset.lockedAmount.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">赎回价格</p>
                                <p className="font-medium">{formatCurrency(asset.redemptionRatio)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">总价值</p>
                                <p className="font-medium">{formatCurrency(asset.balance * asset.redemptionRatio)}</p>
                              </div>
                            </div>
                            
                            {asset.isLocked && (
                              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                                <div className="flex items-center text-orange-800">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  <span className="text-sm">
                                    锁定期至: {formatDate(asset.lockEndDate)}
                                  </span>
                                </div>
                                <p className="text-xs text-orange-600 mt-1">
                                  提前赎回将收取 {(asset.penaltyRate * 100).toFixed(1)}% 手续费
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <div className="ml-4 space-y-2">
                            <Button 
                              onClick={() => handleRedeemRequest(asset)}
                              disabled={asset.availableAmount === 0}
                              size="sm"
                            >
                              {asset.availableAmount > 0 ? '赎回' : '暂不可赎回'}
                            </Button>
                            {asset.isLocked && asset.lockedAmount > 0 && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRedeemRequest(asset)}
                              >
                                提前赎回
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 赎回历史标签页 */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>赎回记录</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>资产</TableHead>
                      <TableHead>赎回数量</TableHead>
                      <TableHead>赎回价值</TableHead>
                      <TableHead>手续费</TableHead>
                      <TableHead>实际获得</TableHead>
                      <TableHead>申请时间</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {redemptionHistory.map((request) => {
                      const asset = redeemableAssets.find(a => a.id === request.assetId);
                      return (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{asset?.tokenSymbol}</p>
                              <p className="text-sm text-gray-500">{asset?.tokenName}</p>
                            </div>
                          </TableCell>
                          <TableCell>{request.amount.toFixed(2)}</TableCell>
                          <TableCell>{formatCurrency(request.estimatedValue)}</TableCell>
                          <TableCell>
                            {request.penaltyAmount > 0 ? (
                              <span className="text-red-600">
                                {formatCurrency(request.penaltyAmount)}
                              </span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {formatCurrency(request.estimatedValue - request.penaltyAmount)}
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(request.requestDate)}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 收益统计标签页 */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>持仓分布</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {redeemableAssets.map((asset) => {
                    const percentage = (asset.balance * asset.redemptionRatio) / 
                      redeemableAssets.reduce((sum, a) => sum + (a.balance * a.redemptionRatio), 0) * 100;
                    
                    return (
                      <div key={asset.id}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">{asset.tokenSymbol}</span>
                          <span className="text-sm">{percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>近期表现</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">+8.5%</p>
                      <p className="text-sm text-gray-600">30天总收益率</p>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">已实现收益</span>
                        <span className="font-medium text-green-600">+$2,145.80</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">未实现收益</span>
                        <span className="font-medium">+$892.40</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">总投入成本</span>
                        <span className="font-medium">$85,230.00</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* 赎回对话框 */}
        <Dialog open={redeemModalOpen} onOpenChange={setRedeemModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>赎回代币</DialogTitle>
              <DialogDescription>
                {selectedAsset && `赎回 ${selectedAsset.tokenName} (${selectedAsset.tokenSymbol})`}
              </DialogDescription>
            </DialogHeader>
            
            {selectedAsset && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">可赎回余额</span>
                    <span className="font-medium">{selectedAsset.availableAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">当前价格</span>
                    <span className="font-medium">{formatCurrency(selectedAsset.redemptionRatio)}</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="redeemAmount">赎回数量</Label>
                  <Input
                    id="redeemAmount"
                    type="number"
                    placeholder="输入赎回数量"
                    value={redeemAmount || ''}
                    onChange={(e) => setRedeemAmount(Number(e.target.value))}
                    max={selectedAsset.availableAmount}
                    className="mt-1"
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>最大: {selectedAsset.availableAmount.toFixed(2)}</span>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-auto p-0 text-xs"
                      onClick={() => setRedeemAmount(selectedAsset.availableAmount)}
                    >
                      全部
                    </Button>
                  </div>
                </div>

                {redeemAmount > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg space-y-2">
                    {(() => {
                      const { baseValue, penalty, netValue, isEarlyWithdrawal } = 
                        calculateRedemptionValue(selectedAsset, redeemAmount);
                      
                      return (
                        <>
                          <div className="flex justify-between text-sm">
                            <span>基础价值</span>
                            <span>{formatCurrency(baseValue)}</span>
                          </div>
                          {isEarlyWithdrawal && penalty > 0 && (
                            <div className="flex justify-between text-sm text-red-600">
                              <span>提前赎回费用</span>
                              <span>-{formatCurrency(penalty)}</span>
                            </div>
                          )}
                          <Separator />
                          <div className="flex justify-between font-medium">
                            <span>实际获得</span>
                            <span className="text-green-600">{formatCurrency(netValue)}</span>
                          </div>
                          {isEarlyWithdrawal && (
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription className="text-xs">
                                此资产仍在锁定期内，提前赎回将产生 {(selectedAsset.penaltyRate * 100).toFixed(1)}% 的手续费。
                              </AlertDescription>
                            </Alert>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setRedeemModalOpen(false)}>
                取消
              </Button>
              <Button 
                onClick={handleConfirmRedemption}
                disabled={loading || !redeemAmount || redeemAmount <= 0}
              >
                {loading ? '处理中...' : '确认赎回'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
