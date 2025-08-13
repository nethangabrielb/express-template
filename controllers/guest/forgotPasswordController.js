import { PrismaClient } from "../../generated/prisma/client.js";

const forgotPasswordController = (() => {
  const prisma = new PrismaClient();

  const forgotPassword = (req, res) => {};

  return { forgotPassword };
})();

export default forgotPasswordController;
