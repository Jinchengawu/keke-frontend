import { NextRequest, NextResponse } from 'next/server';

interface TokenCreationData {
  name: string;
  symbol: string;
  description: string;
  tokenAddress: string;
  transactionHash: string;
  creator: string;
  network: string;
  createdAt: string;
}

// 简单的内存存储（生产环境应该使用数据库）
const tokenRecords: TokenCreationData[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const tokenRecord: TokenCreationData = {
      name: body.name,
      symbol: body.symbol,
      description: body.description,
      tokenAddress: body.tokenAddress,
      transactionHash: body.transactionHash,
      creator: body.creator,
      network: body.network || 'BSC Testnet',
      createdAt: new Date().toISOString(),
    };

    // 添加到记录中
    tokenRecords.push(tokenRecord);

    return NextResponse.json({
      success: true,
      message: '代币记录已保存',
      data: tokenRecord
    });

  } catch (error) {
    console.error('Save token record error:', error);
    return NextResponse.json(
      { success: false, message: '保存代币记录失败' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // 返回最近创建的代币（最多50个）
    const recentTokens = tokenRecords
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50);

    return NextResponse.json({
      success: true,
      data: recentTokens,
      total: tokenRecords.length
    });

  } catch (error) {
    console.error('Get token records error:', error);
    return NextResponse.json(
      { success: false, message: '获取代币记录失败' },
      { status: 500 }
    );
  }
}
