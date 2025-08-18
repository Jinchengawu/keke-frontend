import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {

    // 模拟用户余额数据
    const mockBalances = [
      { tokenId: 'eth', balance: 5.2341 },
      { tokenId: 'usdc', balance: 12450.00 },
      { tokenId: 'rwa-nyc', balance: 850.30 },
      { tokenId: 'rwa-london', balance: 420.15 },
      { tokenId: 'rwa-tokyo', balance: 1250.75 }
    ];

    // 模拟代币信息
    const tokens = [
      { id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 2340.50, icon: '🔷' },
      { id: 'usdc', symbol: 'USDC', name: 'USD Coin', price: 1.00, icon: '💵' },
      { id: 'rwa-nyc', symbol: 'NYC-RWA', name: '纽约房产代币', price: 125.80, icon: '🏢' },
      { id: 'rwa-london', symbol: 'LON-RWA', name: '伦敦房产代币', price: 89.25, icon: '🏛️' },
      { id: 'rwa-tokyo', symbol: 'TKY-RWA', name: '东京房产代币', price: 67.40, icon: '🏯' }
    ];

    const balancesWithDetails = mockBalances.map(balance => {
      const token = tokens.find(t => t.id === balance.tokenId);
      const value = balance.balance * (token?.price || 0);
      return {
        ...balance,
        token,
        value
      };
    });

    const totalValue = balancesWithDetails.reduce((sum, balance) => sum + balance.value, 0);

    return NextResponse.json({
      success: true,
      message: '获取用户余额成功',
      data: {
        totalValue,
        balances: balancesWithDetails
      }
    });

  } catch (error) {
    console.error('Get user balances error:', error);
    return NextResponse.json({
      success: false,
      message: '服务器内部错误'
    }, { status: 500 });
  }
}
