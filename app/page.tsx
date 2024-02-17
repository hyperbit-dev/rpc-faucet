import { FaucetClient } from "@/components";
import rpcClient from "@/utils/rpc";

export default async function Home() {
  const balance = await rpcClient.request(
    "getbalance",
    {},
    {
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );
  const address = await rpcClient.request(
    "getaccountaddress",
    {
      account: "",
    },
    {
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );
  const transactions = await rpcClient.request(
    "listtransactions",
    {
      count: 5,
    },
    {
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );

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
