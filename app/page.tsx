import { FaucetClient } from "./_components";

export default async function Home() {
  const faucet = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/balance`).then(
    (x) => x.json()
  );
  return <FaucetClient faucet={faucet} />;
}
