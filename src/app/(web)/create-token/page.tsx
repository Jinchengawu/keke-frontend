'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload,
  Rocket,
  Twitter,
  ExternalLink,
  Flame,
  Trophy,
  AlertCircle,
  Wallet,
  Globe
} from 'lucide-react';
import { useWeb3 } from '@/hooks/useWeb3';
import { 
  createToken, 
  calculateCreationFee, 
  getCurrentNetworkId, 
  switchNetwork,
  type TokenCreationParams 
} from '@/services/token-factory-service';
import './index.css';

interface TokenData {
  name: string;
  symbol: string;
  description: string;
  fundraiseValue: number;
  fundraiseCurrency: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  tokenType: string;
  enableLiquidity: boolean;
  tokenImage?: string;
  tokenAddress?: string;
  transactionHash?: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CreateTokenPage() {
  const { address, isConnected, isConnecting, connectWallet } = useWeb3();
  const { toast } = useToast();
  
  // 表单状态
  const [formData, setFormData] = useState<TokenData>({
    name: '',
    symbol: '',
    description: '',
    fundraiseValue: 1,
    fundraiseCurrency: 'BNB',
    website: '',
    twitter: '',
    telegram: '',
    tokenType: 'meme',
    enableLiquidity: false,
  });
  
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [creationFee, setCreationFee] = useState<number>(0);

  // 处理输入变化
  const handleInputChange = (field: keyof TokenData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      toast({
        title: "文件类型错误",
        description: "请选择图片文件",
        variant: "destructive",
      });
      return;
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "文件太大",
        description: "图片大小不能超过5MB",
        variant: "destructive",
      });
      return;
    }

    // 创建预览URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入代币名称';
    } else if (formData.name.length < 2) {
      newErrors.name = '代币名称至少2个字符';
    }

    if (!formData.symbol.trim()) {
      newErrors.symbol = '请输入代币符号';
    } else if (formData.symbol.length < 2 || formData.symbol.length > 10) {
      newErrors.symbol = '代币符号应为2-10个字符';
    }

    if (!formData.description.trim()) {
      newErrors.description = '请输入代币描述';
    } else if (formData.description.length < 10) {
      newErrors.description = '描述至少10个字符';
    }

    if (formData.fundraiseValue <= 0) {
      newErrors.fundraiseValue = '筹款目标必须大于0';
    }

    // URL验证
    if (formData.website && formData.website.trim()) {
      const urlRegex = /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlRegex.test(formData.website)) {
        newErrors.website = '请输入有效的网站链接';
      }
    }

    if (formData.twitter && formData.twitter.trim()) {
      const twitterRegex = /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/;
      if (!twitterRegex.test(formData.twitter)) {
        newErrors.twitter = '请输入有效的推特链接';
      }
    }

    if (formData.telegram && formData.telegram.trim()) {
      const telegramRegex = /^https?:\/\/(www\.)?t\.me\/[a-zA-Z0-9_]+\/?$/;
      if (!telegramRegex.test(formData.telegram)) {
        newErrors.telegram = '请输入有效的电报链接';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 准备提交
  const handleSubmit = async () => {
    if (!isConnected) {
      toast({
        title: "钱包未连接",
        description: "请先连接钱包",
        variant: "destructive",
      });
      await connectWallet();
      return;
    }

    if (!validateForm()) {
      return;
    }

    // 计算创建费用
    const fee = calculateCreationFee(formData.fundraiseValue, formData.fundraiseCurrency);
    setCreationFee(Number(fee) / 1e18);
    setShowConfirmDialog(true);
  };

  // 执行代币创建
  const executeTokenCreation = async () => {
    setShowConfirmDialog(false);
    setLoading(true);

    try {
      // 检查网络
      const currentNetworkId = await getCurrentNetworkId();
      const targetNetworkId = 97; // BSC 测试网
      
      if (currentNetworkId !== targetNetworkId) {
        toast({
          title: "切换网络",
          description: "正在切换到 BSC 测试网...",
        });
        await switchNetwork(targetNetworkId);
      }

      // 准备代币创建参数
      const creationParams: TokenCreationParams = {
        name: formData.name,
        symbol: formData.symbol,
        description: formData.description,
        totalSupply: BigInt(1000000), // 默认100万代币
        decimals: 18, // 标准18位小数
        fundraiseValue: formData.fundraiseValue,
        fundraiseCurrency: formData.fundraiseCurrency,
        website: formData.website,
        twitter: formData.twitter,
        telegram: formData.telegram,
        tokenType: formData.tokenType,
        enableLiquidity: formData.enableLiquidity,
        tokenImage: imageUrl,
      };

      // 发射代币
      toast({
        title: "创建中",
        description: "正在发射代币到区块链...",
      });
      
      const result = await createToken(creationParams);
      
      toast({
        title: "创建成功！",
        description: "代币已成功发射到区块链",
      });
      
      // 更新状态
      setTokenData({
        ...formData,
        tokenAddress: result.tokenAddress,
        transactionHash: result.transactionHash,
        tokenImage: imageUrl,
      });
      
    } catch (error: any) {
      console.error('Launch error:', error);
      
      let errorMessage = '未知错误';
      if (error.message.includes('用户取消')) {
        errorMessage = '用户取消了交易';
      } else if (error.message.includes('余额不足')) {
        errorMessage = 'BNB 余额不足，无法支付创建费用';
      } else if (error.message.includes('网络')) {
        errorMessage = '网络连接错误，请检查钱包网络设置';
      } else {
        errorMessage = error.message || '代币发射失败';
      }
      
      toast({
        title: "创建失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 如果已创建代币，显示成功页面
  if (tokenData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800/90 border-gray-700/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">🚀 发射成功!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-gray-300">
              <p className="text-lg font-medium">{tokenData.name} ({tokenData.symbol})</p>
              <p className="text-sm">已成功发射到区块链</p>
            </div>
            
            {tokenData.tokenAddress && (
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">代币地址</p>
                <p className="text-sm text-white font-mono break-all">
                  {tokenData.tokenAddress}
                </p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                onClick={() => window.location.reload()}
              >
                创建新代币
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => window.open(`/swap`, '_blank')}
              >
                去交易
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-2xl mx-auto pt-8 pb-12 px-4">
        <Card className="bg-gray-800/90 border-gray-700/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center text-2xl mb-4">
              <Rocket className="mr-3 text-purple-400" />
              发布你的代币
            </CardTitle>
            <p className="text-gray-300 text-lg">
              创建属于你的 Meme 代币，启动社区驱动的项目
            </p>
          </CardHeader>

          <CardContent>
            {/* 连接钱包提示 */}
            {!isConnected && (
              <Alert className="mb-6 bg-yellow-500/10 border-yellow-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-yellow-100">
                  <div className="flex items-center justify-between">
                    <span>发射代币需要连接到您的 Web3 钱包</span>
                    <Button size="sm" onClick={connectWallet} disabled={isConnecting}>
                      <Wallet className="w-4 h-4 mr-2" />
                      {isConnecting ? '连接中...' : '连接钱包'}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                <h3 className="text-white text-lg font-medium flex items-center">
                  <Flame className="mr-2 text-orange-400" />
                  基本信息
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">代币名称 *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="例如: Doge Coin"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="symbol" className="text-gray-300">代币符号 *</Label>
                    <Input
                      id="symbol"
                      value={formData.symbol}
                      onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                      placeholder="例如: DOGE"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    />
                    {errors.symbol && <p className="text-red-400 text-sm mt-1">{errors.symbol}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-300">代币描述 *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="描述你的代币用途、愿景和特色..."
                    rows={4}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  />
                  {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <Label className="text-gray-300">代币图标</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-500 bg-gray-700/20"
                    >
                      {imageUrl ? (
                        <img src={imageUrl} alt="Token preview" className="h-full object-cover rounded" />
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-gray-400">点击上传图片</p>
                          <p className="text-gray-500 text-xs">支持 JPG, PNG, 最大5MB</p>
                        </div>
                      )}
                    </Label>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* 筹款设置 */}
              <div className="space-y-4">
                <h3 className="text-white text-lg font-medium">💰 筹款设置</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fundraiseValue" className="text-gray-300">筹款目标 *</Label>
                    <Input
                      id="fundraiseValue"
                      type="number"
                      value={formData.fundraiseValue}
                      onChange={(e) => handleInputChange('fundraiseValue', Number(e.target.value))}
                      min="0.1"
                      step="0.1"
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                    {errors.fundraiseValue && <p className="text-red-400 text-sm mt-1">{errors.fundraiseValue}</p>}
                  </div>

                  <div>
                    <Label htmlFor="fundraiseCurrency" className="text-gray-300">筹款币种</Label>
                    <Select value={formData.fundraiseCurrency} onValueChange={(value) => handleInputChange('fundraiseCurrency', value)}>
                      <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BNB">BNB</SelectItem>
                        <SelectItem value="USDT">USDT</SelectItem>
                        <SelectItem value="BUSD">BUSD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* 社交链接 */}
              <div className="space-y-4">
                <h3 className="text-white text-lg font-medium">🌐 社交链接 (可选)</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="website" className="text-gray-300 flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      官方网站
                    </Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://yourproject.com"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    />
                    {errors.website && <p className="text-red-400 text-sm mt-1">{errors.website}</p>}
                  </div>

                  <div>
                    <Label htmlFor="twitter" className="text-gray-300 flex items-center">
                      <Twitter className="w-4 h-4 mr-2" />
                      推特链接
                    </Label>
                    <Input
                      id="twitter"
                      value={formData.twitter}
                      onChange={(e) => handleInputChange('twitter', e.target.value)}
                      placeholder="https://twitter.com/yourproject"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    />
                    {errors.twitter && <p className="text-red-400 text-sm mt-1">{errors.twitter}</p>}
                  </div>

                  <div>
                    <Label htmlFor="telegram" className="text-gray-300">电报群组</Label>
                    <Input
                      id="telegram"
                      value={formData.telegram}
                      onChange={(e) => handleInputChange('telegram', e.target.value)}
                      placeholder="https://t.me/yourproject"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    />
                    {errors.telegram && <p className="text-red-400 text-sm mt-1">{errors.telegram}</p>}
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* 高级设置 */}
              <div className="space-y-4">
                <h3 className="text-white text-lg font-medium">⚙️ 高级设置</h3>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">代币类型</Label>
                    <Select value={formData.tokenType} onValueChange={(value) => handleInputChange('tokenType', value)}>
                      <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meme">Meme 代币</SelectItem>
                        <SelectItem value="utility">实用代币</SelectItem>
                        <SelectItem value="defi">DeFi 代币</SelectItem>
                        <SelectItem value="social">社交代币</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-300">启用流动性池</Label>
                      <p className="text-gray-500 text-sm">自动为代币创建交易对</p>
                    </div>
                    <Switch
                      checked={formData.enableLiquidity}
                      onCheckedChange={(checked) => handleInputChange('enableLiquidity', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="pt-6">
                <Button 
                  onClick={handleSubmit}
                  disabled={!isConnected || loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  size="lg"
                >
                  {loading ? (
                    <>Loading...</>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5 mr-2" />
                      发射代币
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 确认对话框 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>确认代币发射</DialogTitle>
            <DialogDescription className="text-gray-300">
              请确认以下信息无误后发射代币
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p><strong>代币名称:</strong> {formData.name} ({formData.symbol})</p>
              <p><strong>创建费用:</strong> {creationFee.toFixed(4)} BNB</p>
              <p><strong>网络:</strong> BSC 测试网</p>
            </div>
            <p className="text-gray-400 text-sm">
              请确保您的钱包有足够的 BNB 来支付创建费用
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              取消
            </Button>
            <Button onClick={executeTokenCreation} disabled={loading}>
              确认发射
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
