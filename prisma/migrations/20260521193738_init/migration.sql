-- CreateTable
CREATE TABLE "SelfTrustMoment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "situation" TEXT NOT NULL,
    "selfSignal" TEXT NOT NULL,
    "chosenAction" TEXT NOT NULL,
    "feelingsAfter" TEXT NOT NULL,
    "difficulty" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SelfTrustMoment_pkey" PRIMARY KEY ("id")
);
