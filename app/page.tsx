"use client";
import { useQuery } from "@tanstack/react-query";
import { FaucetClient } from "@/components";

export default function Home() {
  const getFaucetQuery = useQuery({
    queryKey: ["faucet"],
    queryFn: () =>
      fetch(`/api/balance`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      }).then((x) => x.json()),
      refetchInterval: 1000 * 60,
  });

  return (
    <FaucetClient
      balance={getFaucetQuery.data?.balance}
      address={getFaucetQuery.data?.address}
      transactions={getFaucetQuery.data?.transactions}
    />
  );
}
