export function FaucetTransactions({ transactions }: { transactions: any[] }) {
  function handleCopy(value: string) {
    navigator.clipboard.writeText(value);
    alert("Copied Transaction ID: " + value);
  }

  return (
    <>
      <h2 className="mb-1 text-lg">Recent Transactions</h2>
      <div className="border border-gray-200 divide-y rounded">
        {transactions.map((tx) => (
          <div key={tx.txid} className="flex items-center justify-between p-2">
            <dl className="grid grid-cols-[100px_auto] gap-y-1">
              <dt className="text-xs">ID</dt>
              <dd className="flex items-center gap-2 text-xs">
                <span>{`${tx.txid.substring(0, 15)}...${tx.txid.substring(
                  tx.txid.length - 15,
                  tx.txid.length
                )}`}</span>
                <button type="button" onClick={() => handleCopy(tx.txid)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15px"
                    height="15px"
                    viewBox="0 0 1024 1024"
                  >
                    <path
                      fill="#000000"
                      d="M768 832a128 128 0 0 1-128 128H192A128 128 0 0 1 64 832V384a128 128 0 0 1 128-128v64a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64h64z"
                    />
                    <path
                      fill="#000000"
                      d="M384 128a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64V192a64 64 0 0 0-64-64H384zm0-64h448a128 128 0 0 1 128 128v448a128 128 0 0 1-128 128H384a128 128 0 0 1-128-128V192A128 128 0 0 1 384 64z"
                    />
                  </svg>
                </button>
              </dd>
              <dt className="text-xs">Block Hash</dt>
              {tx.blockhash ? (
                <dd className="flex items-center gap-2 text-xs">
                  <span>{`${tx.blockhash.substring(
                    0,
                    15
                  )}...${tx.blockhash.substring(
                    tx.blockhash.length - 15,
                    tx.blockhash.length
                  )}`}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(tx.blockhash)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15px"
                      height="15px"
                      viewBox="0 0 1024 1024"
                    >
                      <path
                        fill="#000000"
                        d="M768 832a128 128 0 0 1-128 128H192A128 128 0 0 1 64 832V384a128 128 0 0 1 128-128v64a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64h64z"
                      />
                      <path
                        fill="#000000"
                        d="M384 128a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64V192a64 64 0 0 0-64-64H384zm0-64h448a128 128 0 0 1 128 128v448a128 128 0 0 1-128 128H384a128 128 0 0 1-128-128V192A128 128 0 0 1 384 64z"
                      />
                    </svg>
                  </button>
                </dd>
              ) : undefined}
              <dt className="text-xs">Amount</dt>
              <dd className="text-xs">{Math.abs(tx.amount)}</dd>
              <dt className="text-xs">Fee</dt>
              <dd className="text-xs">{tx.fee ? Math.abs(tx.fee) : "N/A"}</dd>
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}
