"use client";
import { FaucetForm } from "./FaucetForm";
import { FaucetTransactions } from "./FaucetTransactions";

export function FaucetClient({
  balance,
  address,
  transactions = [],
}: {
  balance: number;
  address: string;
  transactions: any[];
}) {
  return (
    <div className="gap-2 p-8 mx-auto md:h-full md:items-center md:justify-center md:flex-row md:flex max-w-7xl">
      <div className="md:w-1/2">
        <FaucetForm
          faucet={{
            balance,
            address,
            transactions,
          }}
        />
      </div>
      <div className="md:w-1/2">
        <FaucetTransactions transactions={transactions} />
      </div>
    </div>
  );
}
