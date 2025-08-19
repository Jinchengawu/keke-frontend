'use client';

import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Space, 
  Alert, 
  Select,
  Switch,
  Upload,
  message,
  Row,
  Col,
  InputNumber,
  Divider,
  Modal
} from 'antd';
import { 
  UploadOutlined,
  RocketOutlined,
  TwitterOutlined,
  LinkOutlined,
  FireOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useWeb3 } from '@/hooks/useWeb3';
import { 
  createToken, 
  calculateCreationFee, 
  getCurrentNetworkId, 
  switchNetwork,
  type TokenCreationParams 
} from '@/services/token-factory-service';
import './index.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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

export default function CreateTokenPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  
  const { address, isConnected, connectWallet } = useWeb3();

  // 募集货币选项
  const fundraiseCurrencies = [
    { value: 'BNB', label: 'BNB', icon: '🟡' },
    { value: 'ETH', label: 'ETH', icon: '⚫' },
    { value: 'USDT', label: 'USDT', icon: '🟢' },
  ];

  // 代币类型选项
  const tokenTypes = [
    { value: 'meme', label: 'Meme', description: '模因代币，社区驱动' },
    { value: 'utility', label: 'Utility', description: '实用代币，功能性价值' },
    { value: 'governance', label: 'Governance', description: '治理代币，投票权利' },
    { value: 'defi', label: 'DeFi', description: '去中心化金融代币' },
  ];

  // 图片上传配置
  const uploadProps: UploadProps = {
    name: 'image',
    listType: 'picture-card',
    className: 'avatar-uploader',
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/webp';
      if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG/GIF/WEBP 格式的图片!');
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('图片大小不能超过 5MB!');
        return false;
      }
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      return false; // 阻止自动上传
    },
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    if (!isConnected) {
      message.warning('请先连接钱包');
      await connectWallet();
      return;
    }

    setLoading(true);
    try {
      // 检查网络
      const currentNetworkId = await getCurrentNetworkId();
      const targetNetworkId = 97; // BSC 测试网
      
      if (currentNetworkId !== targetNetworkId) {
        message.info('切换到 BSC 测试网...');
        await switchNetwork(targetNetworkId);
      }

      const formData: TokenData = {
        name: values.name,
        symbol: values.symbol,
        description: values.description,
        fundraiseValue: values.fundraiseValue,
        fundraiseCurrency: values.fundraiseCurrency,
        website: values.website,
        twitter: values.twitter,
        telegram: values.telegram,
        tokenType: values.tokenType,
        enableLiquidity: values.enableLiquidity || false,
        tokenImage: imageUrl,
      };
      
      // 计算创建费用
      const creationFee = calculateCreationFee(formData.fundraiseValue, formData.fundraiseCurrency);
      const feeInBNB = Number(creationFee) / 1e18;
      
      // 显示费用确认
      const confirmed = await new Promise<boolean>((resolve) => {
        Modal.confirm({
          title: '确认代币发射',
          content: (
            <div>
              <p>即将发射代币: <strong>{formData.name} ({formData.symbol})</strong></p>
              <p>创建费用: <strong>{feeInBNB.toFixed(4)} BNB</strong></p>
              <p>网络: <strong>BSC 测试网</strong></p>
              <p className="text-gray-500 text-sm mt-2">
                请确保您的钱包有足够的 BNB 来支付创建费用
              </p>
            </div>
          ),
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
          okText: '确认发射',
          cancelText: '取消',
        });
      });

      if (!confirmed) {
        setLoading(false);
        return;
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
        tokenImage: formData.tokenImage,
      };

      // 发射代币
      message.loading('正在发射代币到区块链...', 0);
      
      const result = await createToken(creationParams);
      
      message.destroy();
      message.success('代币发射成功！');
      
      // 更新状态
      setTokenData({
        ...formData,
        tokenAddress: result.tokenAddress,
        transactionHash: result.transactionHash,
      } as any);
      
      console.log('Token creation result:', result);
      
    } catch (error: any) {
      message.destroy();
      console.error('Launch error:', error);
      
      if (error.message.includes('用户取消')) {
        message.warning('用户取消了交易');
      } else if (error.message.includes('余额不足')) {
        message.error('BNB 余额不足，无法支付创建费用');
      } else if (error.message.includes('网络')) {
        message.error('网络连接错误，请检查钱包网络设置');
      } else {
        message.error(`代币发射失败: ${error.message || '未知错误'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 验证推特URL
  const validateTwitterUrl = (_: any, value: string) => {
    if (!value) return Promise.resolve();
    const twitterRegex = /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/;
    if (!twitterRegex.test(value)) {
      return Promise.reject(new Error('请输入有效的推特链接'));
    }
    return Promise.resolve();
  };

  // 验证网站URL
  const validateWebsiteUrl = (_: any, value: string) => {
    if (!value) return Promise.resolve();
    const urlRegex = /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(value)) {
      return Promise.reject(new Error('请输入有效的网站链接'));
    }
    return Promise.resolve();
  };

  // 验证电报URL
  const validateTelegramUrl = (_: any, value: string) => {
    if (!value) return Promise.resolve();
    const telegramRegex = /^https?:\/\/(www\.)?t\.me\/[a-zA-Z0-9_]+\/?$/;
    if (!telegramRegex.test(value)) {
      return Promise.reject(new Error('请输入有效的电报链接'));
    }
    return Promise.resolve();
  };

  return (
    <div className="create-token-container min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-2xl mx-auto pt-8 pb-12 px-4">
        <Card 
          className="token-form-card bg-gray-800/90 border-gray-700/50 backdrop-blur-sm"
          style={{ 
            borderRadius: 16,
            border: '1px solid rgba(107, 114, 128, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* 标题区域 */}
          <div className="text-center mb-8">
            <Title level={2} className="text-white flex items-center justify-center mb-4">
              <RocketOutlined className="mr-3 text-purple-400" />
              发布你的代币
            </Title>
            <Paragraph className="text-gray-300 text-lg">
              创建属于你的 Meme 代币，启动社区驱动的项目
            </Paragraph>
          </div>

          {/* 连接钱包提示 */}
          {!isConnected && (
            <Alert
              message="请先连接钱包"
              description="发射代币需要连接到您的 Web3 钱包"
              type="warning"
              showIcon
              className="mb-6 bg-yellow-500/10 border-yellow-500/20 text-yellow-100"
              action={
                <Button size="small" onClick={connectWallet} type="primary">
                  连接钱包
                </Button>
              }
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="token-form"
            initialValues={{
              fundraiseCurrency: 'BNB',
              tokenType: 'meme',
              enableLiquidity: true
            }}
          >
            <Row gutter={24}>
              {/* 代币图片上传 */}
              <Col span={24} className="mb-4">
                <Form.Item
                  label={<span className="text-gray-200 font-medium">代币图像</span>}
                  name="tokenImage"
                  rules={[{ required: true, message: '请上传代币图像' }]}
                >
                  <Upload {...uploadProps}>
                    <div className="upload-area bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                      {imageUrl ? (
                        <img src={imageUrl} alt="token" className="w-20 h-20 object-cover rounded-lg mx-auto" />
                      ) : (
                        <div>
                          <UploadOutlined className="text-2xl text-gray-400 mb-2" />
                          <div className="text-gray-300">PNG, JPEG, WEBP, GIF</div>
                          <div className="text-gray-400 text-sm">Max Size: 5MB</div>
                        </div>
                      )}
                    </div>
                  </Upload>
                </Form.Item>
              </Col>

              {/* 代币名称 */}
              <Col span={24}>
                <Form.Item
                  label={<span className="text-gray-200 font-medium">代币名称</span>}
                  name="name"
                  rules={[
                    { required: true, message: '请输入代币名称' },
                    { min: 2, max: 50, message: '代币名称长度为2-50个字符' }
                  ]}
                >
                  <Input 
                    placeholder="例如：DogeKing"
                    size="large"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </Form.Item>
              </Col>

              {/* 简介代码 */}
              <Col span={24}>
                <Form.Item
                  label={<span className="text-gray-200 font-medium">简介代码</span>}
                  name="symbol"
                  rules={[
                    { required: true, message: '请输入代币符号' },
                    { min: 2, max: 10, message: '代币符号长度为2-10个字符' },
                    { pattern: /^[A-Z0-9]+$/, message: '代币符号只能包含大写字母和数字' }
                  ]}
                >
                  <Input 
                    placeholder="例如：DKING"
                    size="large"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    style={{ textTransform: 'uppercase' }}
                  />
                </Form.Item>
              </Col>

              {/* 描述 */}
              <Col span={24}>
                <Form.Item
                  label={<span className="text-gray-200 font-medium">描述</span>}
                  name="description"
                  rules={[
                    { required: true, message: '请输入代币描述' },
                    { min: 10, max: 500, message: '描述长度为10-500个字符' }
                  ]}
                >
                  <TextArea 
                    placeholder="描述你的代币项目..."
                    rows={4}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </Form.Item>
              </Col>

              {/* 募集价值 */}
              <Col span={16}>
                <Form.Item
                  label={<span className="text-gray-200 font-medium">募集价值</span>}
                  name="fundraiseValue"
                  rules={[
                    { required: true, message: '请输入募集数量' },
                    { type: 'number', min: 0.1, message: '最小募集数量为0.1' }
                  ]}
                >
                  <InputNumber 
                    placeholder="0.00"
                    size="large"
                    className="w-full bg-gray-700/50 border-gray-600"
                    min={0}
                    step={0.1}
                    precision={2}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label={<span className="text-gray-200 font-medium">货币</span>}
                  name="fundraiseCurrency"
                >
                  <Select size="large" className="currency-select">
                    {fundraiseCurrencies.map(currency => (
                      <Option key={currency.value} value={currency.value}>
                        <Space>
                          <span>{currency.icon}</span>
                          <span>{currency.label}</span>
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Divider className="border-gray-600" />
              </Col>

              {/* 社交媒体链接 */}
              <Col span={24}>
                <Form.Item
                  label={<span className="text-gray-200 font-medium">网站</span>}
                  name="website"
                  rules={[{ validator: validateWebsiteUrl }]}
                >
                  <Input 
                    placeholder="(选填)"
                    size="large"
                    prefix={<LinkOutlined className="text-gray-400" />}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label={<span className="text-gray-200 font-medium">推特</span>}
                  name="twitter"
                  rules={[{ validator: validateTwitterUrl }]}
                >
                  <Input 
                    placeholder="(选填)"
                    size="large"
                    prefix={<TwitterOutlined className="text-gray-400" />}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label={<span className="text-gray-200 font-medium">电报</span>}
                  name="telegram"
                  rules={[{ validator: validateTelegramUrl }]}
                >
                  <Input 
                    placeholder="(选填)"
                    size="large"
                    prefix={<span className="text-gray-400">📱</span>}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Divider className="border-gray-600" />
              </Col>

              {/* 代币类型 */}
              <Col span={24}>
                <Form.Item
                  label={<span className="text-gray-200 font-medium">类型</span>}
                  name="tokenType"
                  rules={[{ required: true, message: '请选择代币类型' }]}
                >
                  <Select size="large" className="token-type-select">
                    {tokenTypes.map(type => (
                      <Option key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-gray-400 text-sm">{type.description}</div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* 启用流动性 */}
              <Col span={24}>
                <Form.Item
                  name="enableLiquidity"
                  valuePropName="checked"
                  className="mb-8"
                >
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                    <div>
                      <Text className="text-gray-200 font-medium">启用流动性</Text>
                      <div className="text-gray-400 text-sm mt-1">
                        自动为代币创建流动性池
                      </div>
                    </div>
                    <Switch 
                      defaultChecked
                      className="bg-gray-600"
                    />
                  </div>
                </Form.Item>
              </Col>

              {/* 发射按钮 */}
              <Col span={24}>
                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    className="w-full h-14 text-lg font-bold border-none rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
                      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
                    }}
                    icon={<FireOutlined />}
                    disabled={!isConnected}
                  >
                    🚀 发射代币
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {/* 成功状态展示 */}
          {tokenData && tokenData.transactionHash && (
            <Card className="mt-6 bg-green-500/10 border-green-500/20">
              <div className="text-center">
                <TrophyOutlined className="text-4xl text-green-400 mb-4" />
                <Title level={4} className="text-green-300">
                  恭喜！代币发射成功
                </Title>
                <Paragraph className="text-green-200 mb-4">
                  {tokenData.name} ({tokenData.symbol}) 已成功发射到 BSC 测试网
                </Paragraph>
                
                {/* 交易详情 */}
                <div className="text-left bg-gray-700/30 rounded-lg p-4 mb-4">
                  <div className="text-gray-300 text-sm space-y-2">
                    <div>
                      <span className="text-gray-400">交易哈希:</span>
                      <br />
                      <a 
                        href={`https://testnet.bscscan.com/tx/${tokenData.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-xs break-all"
                      >
                        {tokenData.transactionHash}
                      </a>
                    </div>
                    {tokenData.tokenAddress && tokenData.tokenAddress !== '0x0000000000000000000000000000000000000000' && (
                      <div>
                        <span className="text-gray-400">代币地址:</span>
                        <br />
                        <a 
                          href={`https://testnet.bscscan.com/token/${tokenData.tokenAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-xs break-all"
                        >
                          {tokenData.tokenAddress}
                        </a>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400">网络:</span> BSC 测试网
                    </div>
                  </div>
                </div>

                <Space wrap>
                  <Button 
                    type="primary" 
                    onClick={() => window.location.href = '/swap'}
                  >
                    去交易市场
                  </Button>
                  <Button 
                    onClick={() => {
                      setTokenData(null);
                      setImageUrl('');
                      form.resetFields();
                    }}
                  >
                    继续创建
                  </Button>
                  <Button 
                    href={`https://testnet.bscscan.com/tx/${tokenData.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    查看交易
                  </Button>
                </Space>
              </div>
            </Card>
          )}
        </Card>
      </div>
    </div>
  );
}
