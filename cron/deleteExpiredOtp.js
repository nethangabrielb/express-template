import cron from "node-cron";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

// Delete expired OTP every 5 minutes
const deleteExpiredOtpTask = () => {
  cron.schedule("* */5 * * * *", async () => {
    const date = new Date();

    await prisma.otp.deleteMany({
      where: {
        expiresAt: {
          lt: date,
        },
      },
    });
  });
};

export default deleteExpiredOtpTask;
