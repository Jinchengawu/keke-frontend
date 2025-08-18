import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {

    // 模拟用户持有的可赎回资产
    const redeemableAssets = [
      {
        id: '1',
        tokenSymbol: 'NYC-RWA',
        tokenName: '纽约房产代币',
        balance: 850.30,
        lockedAmount: 500.00,
        availableAmount: 350.30,
        underlyingAsset: '曼哈顿豪华公寓A座',
        redemptionRatio: 125.80, // 1 token = $125.80
        lockEndDate: new Date('2024-12-31'),
        penaltyRate: 0.15, // 15% penalty for early withdrawal
        isLocked: true,
        currentPrice: 125.80,
        change24h: 2.45
      },
      {
        id: '2',
        tokenSymbol: 'LON-RWA',
        tokenName: '伦敦房产代币',
        balance: 420.15,
        lockedAmount: 0,
        availableAmount: 420.15,
        underlyingAsset: '伦敦市中心办公楼',
        redemptionRatio: 89.25,
        lockEndDate: new Date('2024-06-15'),
        penaltyRate: 0,
        isLocked: false,
        currentPrice: 89.25,
        change24h: -1.23
      },
      {
        id: '3',
        tokenSymbol: 'TKY-RWA',
        tokenName: '东京房产代币',
        balance: 1250.75,
        lockedAmount: 800.00,
        availableAmount: 450.75,
        underlyingAsset: '东京涩谷商业综合体',
        redemptionRatio: 67.40,
        lockEndDate: new Date('2025-03-20'),
        penaltyRate: 0.12,
        isLocked: true,
        currentPrice: 67.40,
        change24h: 3.89
      }
    ];

    // 计算总价值
    const totalValue = redeemableAssets.reduce((sum, asset) => 
      sum + (asset.balance * asset.currentPrice), 0
    );

    const availableValue = redeemableAssets.reduce((sum, asset) => 
      sum + (asset.availableAmount * asset.currentPrice), 0
    );

    const lockedValue = redeemableAssets.reduce((sum, asset) => 
      sum + (asset.lockedAmount * asset.currentPrice), 0
    );

    return NextResponse.json({
      success: true,
      message: '获取可赎回资产成功',
      data: {
        summary: {
          totalValue,
          availableValue,
          lockedValue,
          totalAssets: redeemableAssets.length
        },
        assets: redeemableAssets
      }
    });

  } catch (error) {
    console.error('Get redeemable assets error:', error);
    return NextResponse.json({
      success: false,
      message: '服务器内部错误'
    }, { status: 500 });
  }
}
