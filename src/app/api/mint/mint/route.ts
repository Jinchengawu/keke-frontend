import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const mintTokenSchema = z.object({
  stakeId: z.string()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = mintTokenSchema.parse(body);
    
    // 使用模拟用户ID
    const mock_user_id = 'mock_user_123';

    // 获取质押记录
    const stake = await prisma.stakes.findFirst({
      where: {
        id: validatedData.stakeId,
        userId: mock_user_id,
        status: 'pending'
      }
    });

    if (!stake) {
      return NextResponse.json({ success: false, message: '质押记录不存在或已处理' }, { status: 404 });
    }

    // 模拟区块链交易确认
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

    // 更新质押状态
    const updatedStake = await prisma.stakes.update({
      where: { id: stake.id },
      data: {
        status: 'active',
        transactionHash,
        confirmedAt: new Date()
      }
    });

    // 创建代币余额记录
    const existingBalance = await prisma.tokenBalances.findFirst({
      where: {
        userId: mock_user_id,
        assetId: stake.assetId
      }
    });

    if (existingBalance) {
      await prisma.tokenBalances.update({
        where: { id: existingBalance.id },
        data: {
          balance: existingBalance.balance + stake.tokenAmount
        }
      });
    } else {
      await prisma.tokenBalances.create({
        data: {
          userId: mock_user_id,
          assetId: stake.assetId,
          balance: stake.tokenAmount
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: '代币铸造成功',
      data: {
        stakeId: stake.id,
        tokenAmount: stake.tokenAmount,
        transactionHash,
        confirmedAt: updatedStake.confirmedAt
      }
    });

  } catch (error) {
    console.error('Mint tokens error:', error);
    
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
