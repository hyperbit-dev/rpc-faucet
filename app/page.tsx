import { FaucetClient } from "@/components";
import rpcClient from "@/utils/rpc";

export default async function Home() {
  const balance = await rpcClient.request("getbalance", {});
  const address = await rpcClient.request("getaccountaddress", {
    account: "",
  });
  const transactions = await rpcClient.request("listtransactions", {
    count: 10,
  });

  return (
    <FaucetClient
      faucet={{
        balance,
        address,
        transactions,
      }}
    />
  );
}
