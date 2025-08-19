'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/hooks/useWeb3';
import { 
  Wallet, 
  Copy, 
  LogOut, 
  AlertCircle, 
  CheckCircle 
} from 'lucide-react';

interface WalletConnectProps {
  size?: 'small' | 'default' | 'large';
  className?: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ 
  size = 'default', 
  className = '' 
}) => {
  const { toast } = useToast();
  const { 
    address, 
    isConnected, 
    isConnecting, 
    connectWallet, 
    disconnect 
  } = useWeb3();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
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

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg px-8 py-3';
      default:
        return '';
    }
  };

  if (!isConnected) {
    return (
      <div className={className}>
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className={getSizeClass()}
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isConnecting ? '连接中...' : '连接钱包'}
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">钱包已连接</p>
                <p className="text-sm text-gray-600">{formatAddress(address!)}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              已连接
            </Badge>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={copyAddress}
              className="flex-1"
            >
              <Copy className="w-3 h-3 mr-1" />
              复制地址
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => disconnect()}
              className="flex-1"
            >
              <LogOut className="w-3 h-3 mr-1" />
              断开连接
            </Button>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          钱包连接成功！现在您可以进行代币交易、铸造和赎回操作。
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default WalletConnect;
