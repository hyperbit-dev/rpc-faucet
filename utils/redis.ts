import { createClient } from "redis";
import { Repository, Schema } from "redis-om";

type Redis = {
  host: string;
  port: string;
  user: string;
  password: string;
};

export const redisConfig: Redis = {
  host: process.env.REDIS_HOST!,
  port: process.env.REDIS_PORT!,
  user: process.env.REDIS_USER!,
  password: process.env.REDIS_PASSWORD!,
};

export const faucetSchema = new Schema("faucet", {
  ipAddress: { type: "string" },
  faucetId: { type: "string" },
  time: { type: "string" },
  amount: { type: "number" },
});

const url =
  `redis://${redisConfig.user}:${redisConfig.password}@${redisConfig.host}:${redisConfig.port}` ??
  "redis://localhost:6379";

const redis = createClient({
  url,
});

redis.on("error", (err) => console.log("Redis Client Error", err));

export default async function getRedisFaucet() {
  if (!redis.isOpen) {
    await redis.connect();
  }

  const faucetRepository = new Repository(faucetSchema, redis);

  await faucetRepository.createIndex();

  return faucetRepository;
}
