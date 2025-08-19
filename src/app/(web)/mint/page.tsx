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
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign,
  Home,
  Lock,
  Trophy,
  Calculator,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface PropertyAsset {
  id: string;
  name: string;
  location: string;
  estimatedValue: number;
  monthlyRent: number;
  yieldRate: number;
  tokenRatio: number; // 1 USD = X tokens
}

interface StakeData {
  assetId: string;
  stakeAmount: number;
  estimatedTokens: number;
  lockPeriod: number;
  expectedYield: number;
}

export default function MintPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stakeData, setStakeData] = useState<StakeData>({
    assetId: '',
    stakeAmount: 0,
    estimatedTokens: 0,
    lockPeriod: 30,
    expectedYield: 0
  });

  const [propertyAssets] = useState<PropertyAsset[]>([
    {
      id: 'nyc-manhattan-01',
      name: '曼哈顿豪华公寓',
      location: '纽约市曼哈顿区',
      estimatedValue: 2500000,
      monthlyRent: 8500,
      yieldRate: 4.08,
      tokenRatio: 0.1 // 1 USD = 0.1 tokens
    },
    {
      id: 'london-kensington-01',
      name: '肯辛顿传统别墅',
      location: '伦敦肯辛顿区',
      estimatedValue: 3200000,
      monthlyRent: 12000,
      yieldRate: 4.5,
      tokenRatio: 0.08
    },
    {
      id: 'tokyo-shibuya-01',
      name: '涩谷商业大厦',
      location: '东京涩谷区',
      estimatedValue: 1800000,
      monthlyRent: 7200,
      yieldRate: 4.8,
      tokenRatio: 0.12
    }
  ]);

  const steps = [
    { title: '选择资产', description: '选择要投资的房产资产' },
    { title: '质押金额', description: '输入质押金额和锁定期' },
    { title: '确认交易', description: '确认并完成铸造' }
  ];

  const lockPeriodOptions = [
    { value: 30, label: '30天', bonus: 0 },
    { value: 90, label: '90天', bonus: 0.5 },
    { value: 180, label: '180天', bonus: 1.0 },
    { value: 365, label: '365天', bonus: 2.0 }
  ];

  const selectedAsset = propertyAssets.find(asset => asset.id === stakeData.assetId);
  const selectedLockPeriod = lockPeriodOptions.find(option => option.value === stakeData.lockPeriod);

  // 计算预估代币数量和收益
  const calculateTokensAndYield = (asset: PropertyAsset, amount: number, lockPeriod: number) => {
    if (!asset || !amount) return { tokens: 0, yield: 0 };
    
    const tokens = amount * asset.tokenRatio;
    const bonus = lockPeriodOptions.find(option => option.value === lockPeriod)?.bonus || 0;
    const annualYield = (asset.yieldRate + bonus) / 100 * amount;
    const dailyYield = annualYield / 365;
    const totalYield = dailyYield * lockPeriod;
    
    return { tokens, yield: totalYield };
  };

  const handleAssetSelect = (assetId: string) => {
    setStakeData(prev => ({ ...prev, assetId }));
    if (currentStep === 0) setCurrentStep(1);
  };

  const handleAmountChange = (amount: number) => {
    const asset = selectedAsset;
    if (asset) {
      const { tokens, yield: expectedYield } = calculateTokensAndYield(asset, amount, stakeData.lockPeriod);
      setStakeData(prev => ({
        ...prev,
        stakeAmount: amount,
        estimatedTokens: tokens,
        expectedYield
      }));
    }
  };

  const handleLockPeriodChange = (period: number) => {
    const asset = selectedAsset;
    if (asset) {
      const { tokens, yield: expectedYield } = calculateTokensAndYield(asset, stakeData.stakeAmount, period);
      setStakeData(prev => ({
        ...prev,
        lockPeriod: period,
        estimatedTokens: tokens,
        expectedYield
      }));
    }
  };

  const handleConfirmStaking = async () => {
    if (!selectedAsset || !stakeData.stakeAmount) {
      toast({
        title: "参数错误",
        description: "请选择资产并输入质押金额",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // 模拟交易流程
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "铸造成功！",
        description: `成功铸造 ${stakeData.estimatedTokens.toFixed(2)} 个代币`,
      });
      
      // 重置表单
      setStakeData({
        assetId: '',
        stakeAmount: 0,
        estimatedTokens: 0,
        lockPeriod: 30,
        expectedYield: 0
      });
      setCurrentStep(0);
    } catch (error) {
      toast({
        title: "铸造失败",
        description: "交易过程中发生错误，请重试",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">房产代币铸造</h1>
          <p className="text-gray-600">质押资金并获得房产收益代币，享受稳定的租金收益</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主要内容区 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 步骤指示器 */}
            <Card>
              <CardHeader>
                <CardTitle>铸造流程</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                        ${index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-600'}
                      `}>
                        {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`
                          w-16 h-0.5 mx-2
                          ${index < currentStep ? 'bg-primary' : 'bg-gray-200'}
                        `} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <h3 className="font-medium">{steps[currentStep].title}</h3>
                  <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
                </div>
              </CardContent>
            </Card>

            {/* 第一步：选择资产 */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">选择房产资产</h2>
                {propertyAssets.map((asset) => (
                  <Card 
                    key={asset.id}
                    className={`cursor-pointer transition-colors ${
                      stakeData.assetId === asset.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleAssetSelect(asset.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Home className="w-5 h-5 mr-2 text-blue-600" />
                            <h3 className="font-semibold text-lg">{asset.name}</h3>
                          </div>
                          <p className="text-gray-600 mb-4">{asset.location}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">资产价值</p>
                              <p className="font-medium">{formatCurrency(asset.estimatedValue)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">月租金</p>
                              <p className="font-medium">{formatCurrency(asset.monthlyRent)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">年化收益率</p>
                              <p className="font-medium text-green-600">{asset.yieldRate}%</p>
                            </div>
                            <div>
                              <p className="text-gray-500">代币比例</p>
                              <p className="font-medium">1:0.{(asset.tokenRatio * 10).toFixed(0)}</p>
                            </div>
                          </div>
                        </div>
                        
                        <Badge variant="secondary" className="ml-4">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {asset.yieldRate}% APY
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* 第二步：质押金额 */}
            {currentStep === 1 && selectedAsset && (
              <Card>
                <CardHeader>
                  <CardTitle>质押参数设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Home className="w-5 h-5 mr-2 text-blue-600" />
                      <h3 className="font-medium">{selectedAsset.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{selectedAsset.location}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="stakeAmount">质押金额 (USD)</Label>
                      <Input
                        id="stakeAmount"
                        type="number"
                        placeholder="输入质押金额"
                        value={stakeData.stakeAmount || ''}
                        onChange={(e) => handleAmountChange(Number(e.target.value))}
                        className="mt-1"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        最小质押金额: $1,000
                      </p>
                    </div>

                    <div>
                      <Label>锁定期</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {lockPeriodOptions.map((option) => (
                          <Button
                            key={option.value}
                            variant={stakeData.lockPeriod === option.value ? "default" : "outline"}
                            onClick={() => handleLockPeriodChange(option.value)}
                            className="h-auto p-3 flex-col"
                          >
                            <span className="font-medium">{option.label}</span>
                            {option.bonus > 0 && (
                              <span className="text-xs text-green-600">+{option.bonus}% 奖励</span>
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {stakeData.stakeAmount > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <h4 className="font-medium">预估收益</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">获得代币</p>
                            <p className="font-medium text-lg">{stakeData.estimatedTokens.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">锁定期收益</p>
                            <p className="font-medium text-lg text-green-600">
                              {formatCurrency(stakeData.expectedYield)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">年化收益率</p>
                            <p className="font-medium text-lg">
                              {(selectedAsset.yieldRate + (selectedLockPeriod?.bonus || 0)).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setCurrentStep(0)}>
                        返回
                      </Button>
                      <Button 
                        onClick={() => setCurrentStep(2)}
                        disabled={!stakeData.stakeAmount || stakeData.stakeAmount < 1000}
                        className="flex-1"
                      >
                        下一步
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 第三步：确认交易 */}
            {currentStep === 2 && selectedAsset && (
              <Card>
                <CardHeader>
                  <CardTitle>确认交易详情</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      请仔细确认以下交易详情，确认后资金将被锁定直到期限结束。
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">投资资产</h4>
                        <p className="text-sm">{selectedAsset.name}</p>
                        <p className="text-xs text-gray-600">{selectedAsset.location}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">质押金额</h4>
                        <p className="text-lg font-bold">{formatCurrency(stakeData.stakeAmount)}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">锁定期限</h4>
                        <p className="text-sm">{stakeData.lockPeriod} 天</p>
                        {selectedLockPeriod?.bonus && (
                          <p className="text-xs text-green-600">包含 +{selectedLockPeriod.bonus}% 奖励</p>
                        )}
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">获得代币</h4>
                        <p className="text-lg font-bold">{stakeData.estimatedTokens.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2 text-green-800">预期收益</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-green-600">锁定期总收益</p>
                          <p className="font-bold text-green-800">{formatCurrency(stakeData.expectedYield)}</p>
                        </div>
                        <div>
                          <p className="text-green-600">年化收益率</p>
                          <p className="font-bold text-green-800">
                            {(selectedAsset.yieldRate + (selectedLockPeriod?.bonus || 0)).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      返回修改
                    </Button>
                    <Button 
                      onClick={handleConfirmStaking}
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? '处理中...' : '确认铸造'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>平台统计</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">$125.8M</p>
                  <p className="text-sm text-gray-600">总锁定价值</p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">活跃用户</span>
                    <span className="font-medium">12,453</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">平均APY</span>
                    <span className="font-medium text-green-600">4.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">总房产价值</span>
                    <span className="font-medium">$2.8B</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>风险提示</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    房产投资存在市场风险，收益可能会波动。
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    质押期间资金将被锁定，无法提前赎回。
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    收益按月分发，基于实际租金收入。
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}