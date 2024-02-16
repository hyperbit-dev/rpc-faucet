import { Entity, EntityId } from "redis-om";
import getRedisFaucet from "./redis";

async function findInCache(ipAddress: string) {
  const faucetRepository = await getRedisFaucet();
  const faucetId = process.env.REDIS_FAUCET_ID!;

  return faucetRepository
    .search()
    .where("ipAddress")
    .equals(ipAddress)
    .and("faucetId")
    .equals(faucetId)
    .return.first();
}

async function storeInCache(data: Entity): Promise<Entity> {
  const faucetRepository = await getRedisFaucet();
  if (data[EntityId]) {
    await faucetRepository.save(data);
    return data;
  } else {
    const faucet = await faucetRepository.save({
      ipAddress: data.ipAddress,
      amount: data.amount,
      count: data.count,
      time: data.time,
    });

    const ttlInSeconds = 24 * 60 * 60; // 24 hours
    const id = faucet[EntityId] as string;

    await faucetRepository.expire(id, ttlInSeconds);
    return faucet;
  }
}

export async function getFaucet({
  ipAddress,
  amount,
}: {
  ipAddress: string;
  amount: number | string;
}): Promise<Entity> {
  const start = Date.now();
  const redisFaucet = await findInCache(ipAddress);

  if (redisFaucet) {
    redisFaucet.amount = Number(redisFaucet.amount) + Number(amount);
    await storeInCache(redisFaucet);

    return {
      faucet: redisFaucet,
      cached: true,
      time: Date.now() - start,
    };
  }

  const faucetData = {
    ipAddress,
    amount,
    time: Date.now() - start,
  };

  const data = await storeInCache(faucetData);

  return {
    faucet: faucetData,
    cached: false,
    time: data.time,
  };
}
