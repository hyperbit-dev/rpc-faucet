import { getFaucet } from "@/utils/faucet";
import rpcClient from "@/utils/rpc";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

const PAYOUT_AMOUNT = Number(process.env.PAYOUT_AMOUNT ?? 0);
const PAYOUT_LIMIT = Number(process.env.PAYOUT_LIMIT ?? 0);
const PAYOUT_INTERVAL = Number(process.env.PAYOUT_INTERVAL ?? 0);

export async function POST(req: NextRequest) {
  const { address, captcha } = await req.json();

  if (!address || !captcha) {
    return Response.json(
      {
        message: "Unproccesable request, please provide the required fields",
      },
      { status: 422 }
    );
  }

  // uuidv4 for localhost
  const ipAddress =
    req.ip ||
    req.headers.get("x-real-ip") ||
    headers().get("x-real-ip") ||
    uuidv4();
  const redisUser = await getFaucet({
    ipAddress: ipAddress!,
    amount: PAYOUT_AMOUNT,
  });

  if (redisUser && (Number(redisUser.amount) ?? 0) >= PAYOUT_LIMIT) {
    const totalMinutes = PAYOUT_INTERVAL ?? 24 * 60 * 1000;
    const currentMinutes = totalMinutes - (redisUser.time as number);
    const currentHours = currentMinutes / 60 / 1000;
    return Response.json(
      {
        message: `Limit reached. Please come back in ${Math.floor(
          currentHours
        )} hours.`,
      },
      { status: 400 }
    );
  }

  try {
    // Ping the google recaptcha verify API to verify the captcha code you received
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
        method: "POST",
      }
    );

    const captchaValidation = await recaptchaResponse.json();
    if (captchaValidation.success) {
      const redisAmount = redisUser?.amount
        ? Number(redisUser.amount)
        : PAYOUT_AMOUNT;
      const reqAmount =
        PAYOUT_AMOUNT + redisAmount <= PAYOUT_LIMIT
          ? PAYOUT_AMOUNT
          : PAYOUT_LIMIT - redisAmount;
      const response: any = await rpcClient.request("sendtoaddress", {
        address,
        amount: reqAmount,
      });

      if (response?.code === 500) {
        return Response.json({ message: response.message }, { status: 500 });
      }

      return Response.json(
        {
          transactionId: response,
          amount: PAYOUT_AMOUNT,
        },
        { status: 200 }
      );
    }

    return Response.json(
      { message: "Unproccesable request, Invalid captcha code" },
      { status: 422 }
    );
  } catch (e) {
    return Response.json({ message: (e as Error).message }, { status: 500 });
  }
}
