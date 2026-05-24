-- CreateTable
CREATE TABLE "ThankfulnessMoment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "situation" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "feelings" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThankfulnessMoment_pkey" PRIMARY KEY ("id")
);
