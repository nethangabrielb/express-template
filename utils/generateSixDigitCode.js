import crypto from "crypto";

function generateSixDigitCode() {
  const code = crypto.randomInt(100000, 1000000);
  return code;
}

export default generateSixDigitCode;
