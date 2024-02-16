"use client";
import { FaucetForm } from "./FaucetForm";
import { FaucetTransactions } from "./FaucetTransactions";

export function FaucetClient({
  faucet,
}: {
  faucet: {
    balance: number;
    address: string;
    transactions: any[];
  };
}) {
  faucet = faucet ?? { balance: 0, address: "", transactions: [] };
  console.log("faucet", faucet);
  return (
    <div className="gap-2 p-8 mx-auto md:h-full md:items-center md:justify-center md:flex-row md:flex max-w-7xl">
      <div className="md:w-1/2">
        <FaucetForm faucet={faucet} />
      </div>
      <div className="md:w-1/2">
        <FaucetTransactions transactions={faucet.transactions} />
      </div>
    </div>
  );
}
