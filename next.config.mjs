/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PAYOUT_AMOUNT: process.env.PAYOUT_AMOUNT,
    PAYOUT_LIMIT: process.env.PAYOUT_LIMIT,
    PAYOUT_INTERVAL: process.env.PAYOUT_INTERVAL,
  },
};

export default nextConfig;
