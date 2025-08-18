-- CreateTable for Stakes
CREATE TABLE "stake" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "lockPeriod" INTEGER NOT NULL,
    "tokenAmount" DOUBLE PRECISION NOT NULL,
    "expectedYield" DOUBLE PRECISION NOT NULL,
    "unlockDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "transactionHash" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stake_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Token Balances
CREATE TABLE "tokenBalance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tokenBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Swaps
CREATE TABLE "swap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fromToken" TEXT NOT NULL,
    "toToken" TEXT NOT NULL,
    "fromAmount" DOUBLE PRECISION NOT NULL,
    "toAmount" DOUBLE PRECISION NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL,
    "slippage" DOUBLE PRECISION NOT NULL,
    "transactionHash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "swap_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Liquidity Positions
CREATE TABLE "liquidityPosition" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,
    "token0" TEXT NOT NULL,
    "token1" TEXT NOT NULL,
    "amount0" DOUBLE PRECISION NOT NULL,
    "amount1" DOUBLE PRECISION NOT NULL,
    "lpTokens" DOUBLE PRECISION NOT NULL,
    "transactionHash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "liquidityPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Redemptions
CREATE TABLE "redemption" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "tokenAmount" DOUBLE PRECISION NOT NULL,
    "baseValue" DOUBLE PRECISION NOT NULL,
    "penalty" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "processingFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finalValue" DOUBLE PRECISION NOT NULL,
    "isEarlyRedeem" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "estimatedCompletionDate" TIMESTAMP(3) NOT NULL,
    "transactionHash" TEXT,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "adminComments" TEXT,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "redemption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokenBalance_userId_assetId_key" ON "tokenBalance"("userId", "assetId");

-- AddForeignKey
ALTER TABLE "stake" ADD CONSTRAINT "stake_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tokenBalance" ADD CONSTRAINT "tokenBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "swap" ADD CONSTRAINT "swap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "liquidityPosition" ADD CONSTRAINT "liquidityPosition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "redemption" ADD CONSTRAINT "redemption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
