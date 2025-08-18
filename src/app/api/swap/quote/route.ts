import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const quoteSchema = z.object({
  fromToken: z.string(),
  toToken: z.string(),
  amount: z.number().min(0.000001, '交易金额必须大于0')
});

// 模拟代币数据
const mockTokens = [
  { id: 'eth', price: 2340.50, volume24h: 1250000 },
  { id: 'usdc', price: 1.00, volume24h: 890000 },
  { id: 'rwa-nyc', price: 125.80, volume24h: 45000 },
  { id: 'rwa-london', price: 89.25, volume24h: 28000 },
  { id: 'rwa-tokyo', price: 67.40, volume24h: 67000 }
];

function calculateSlippage(amount: number, volume24h: number): number {
  // 简化的滑点计算
  const liquidityDepth = volume24h * 10; // 假设流动性深度是24小时交易量的10倍
  const slippage = (amount / liquidityDepth) * 0.1; // 简化公式
  return Math.min(slippage, 0.05); // 最大滑点5%
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = quoteSchema.parse(body);

    const fromToken = mockTokens.find(t => t.id === validatedData.fromToken);
    const toToken = mockTokens.find(t => t.id === validatedData.toToken);

    if (!fromToken || !toToken) {
      return NextResponse.json({ success: false, message: '代币不存在' }, { status: 400 });
    }

    // 简化的价格计算（实际应该基于流动性池）
    const rate = fromToken.price / toToken.price;
    const fee = 0.003; // 0.3% 手续费
    const slippage = calculateSlippage(validatedData.amount, fromToken.volume24h);
    
    const outputAmount = validatedData.amount * rate * (1 - fee) * (1 - slippage);
    const priceImpact = slippage * 100;

    return NextResponse.json({
      success: true,
      message: '获取报价成功',
      data: {
      quote: {
        inputAmount: validatedData.amount,
        outputAmount,
        rate,
        fee: fee * 100,
        slippage: slippage * 100,
        priceImpact,
        minimumReceived: outputAmount * 0.98, // 2% 滑点容忍度
        route: [fromToken.id, toToken.id],
        estimatedGas: '0.005 ETH'
      }
      }
    });

  } catch (error) {
    console.error('Get quote error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: '数据验证失败',
        errors: error.issues
      }, { status: 400 });
    }
    
    return NextResponse.json({ success: false, message: '服务器内部错误' }, { status: 500 });
  }
}
