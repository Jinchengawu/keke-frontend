import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const calculateRedemptionSchema = z.object({
  assetId: z.string(),
  tokenAmount: z.number().min(0.000001, '赎回数量必须大于0'),
  isEarlyRedeem: z.boolean()
});

// 模拟资产数据
const mockAssets = [
  {
    id: '1',
    redemptionRatio: 125.80,
    penaltyRate: 0.15,
    isLocked: true,
    balance: 850.30,
    availableAmount: 350.30
  },
  {
    id: '2',
    redemptionRatio: 89.25,
    penaltyRate: 0,
    isLocked: false,
    balance: 420.15,
    availableAmount: 420.15
  },
  {
    id: '3',
    redemptionRatio: 67.40,
    penaltyRate: 0.12,
    isLocked: true,
    balance: 1250.75,
    availableAmount: 450.75
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = calculateRedemptionSchema.parse(body);

    const asset = mockAssets.find(a => a.id === validatedData.assetId);
    if (!asset) {
      return NextResponse.json({ success: false, message: '资产不存在' }, { status: 404 });
    }

    const maxRedeemable = validatedData.isEarlyRedeem ? asset.balance : asset.availableAmount;
    
    if (validatedData.tokenAmount > maxRedeemable) {
      return NextResponse.json({ success: false, message: `超过可赎回数量，最大可赎回: ${maxRedeemable}` }, { status: 400 });
    }

    // 计算基础赎回价值
    const baseValue = validatedData.tokenAmount * asset.redemptionRatio;
    
    // 计算手续费
    let penalty = 0;
    let processingFee = baseValue * 0.005; // 0.5% processing fee
    
    if (validatedData.isEarlyRedeem && asset.isLocked) {
      penalty = baseValue * asset.penaltyRate;
    }

    const finalValue = baseValue - penalty - processingFee;

    // 估算处理时间
    const estimatedDays = validatedData.isEarlyRedeem ? 1 : 3;
    const completionDate = new Date(Date.now() + estimatedDays * 24 * 60 * 60 * 1000);

    return NextResponse.json({
      success: true,
      message: '计算成功',
      data: {
      calculation: {
        tokenAmount: validatedData.tokenAmount,
        baseValue,
        penalty,
        processingFee,
        finalValue,
        redemptionRatio: asset.redemptionRatio,
        isEarlyRedeem: validatedData.isEarlyRedeem,
        estimatedCompletionDate: completionDate,
        processingDays: estimatedDays
      }
      }
    });

  } catch (error) {
    console.error('Calculate redemption error:', error);
    
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
