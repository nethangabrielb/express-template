-- CreateTable
CREATE TABLE "public"."Otp" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Otp_code_key" ON "public"."Otp"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_userId_key" ON "public"."Otp"("userId");

-- AddForeignKey
ALTER TABLE "public"."Otp" ADD CONSTRAINT "Otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
