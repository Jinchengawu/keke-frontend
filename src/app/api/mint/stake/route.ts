import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createStakeSchema = z.object({
  assetId: z.string(),
  amount: z.number().min(1000, '最小质押金额为 $1,000'),
  lockPeriod: z.number().refine(val => [3, 6, 12, 24].includes(val), '锁定期限必须为 3、6、12 或 24 个月')
});

// 模拟计算质押价值
async function calculateStakeValue(assetId: string, amount: number, lockPeriod: number) {
  const asset = { tokenRatio: 1000, yieldRate: 6.35 }; // 简化的资产数据
  
  const baseTokens = amount * asset.tokenRatio;
  const lockBonusMap: Record<number, number> = { 3: 1.0, 6: 1.1, 12: 1.25, 24: 1.5 };
  const lockBonus = lockBonusMap[lockPeriod] || 1.0;
  const finalTokens = Math.floor(baseTokens * lockBonus);
  const annualYield = (amount * asset.yieldRate) / 100;
  const expectedYield = (annualYield * lockPeriod) / 12;
  const unlockDate = new Date(Date.now() + lockPeriod * 30 * 24 * 60 * 60 * 1000);

  return {
    finalTokens,
    expectedYield,
    unlockDate
  };
}

export async function POST(request: NextRequest) {
  try {

    const body = await request.json();
    const validatedData = createStakeSchema.parse(body);

    // 计算质押价值
    const calculation = await calculateStakeValue(
      validatedData.assetId,
      validatedData.amount,
      validatedData.lockPeriod
    );

    // 创建质押记录
    const stake = await prisma.stakes.create({
      data: {
        userId: 'mock_user_id',
        assetId: validatedData.assetId,
        amount: validatedData.amount,
        lockPeriod: validatedData.lockPeriod,
        tokenAmount: calculation.finalTokens,
        expectedYield: calculation.expectedYield,
        unlockDate: calculation.unlockDate,
        status: 'pending',
        createdAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: '质押订单已创建',
      data: {
        stake: {
          id: stake.id,
          ...calculation,
          status: 'pending'
        }
      }
    });

  } catch (error) {
    console.error('Create stake error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: '数据验证失败',
        data: {
          errors: error.issues
        }
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: '服务器内部错误'
    }, { status: 500 });
  }
}
