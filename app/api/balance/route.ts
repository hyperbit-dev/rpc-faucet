import rpcClient from "@/utils/rpc";

export async function GET() {
  try {
    const balance = await rpcClient.request("getbalance", {});
    const address = await rpcClient.request("getaccountaddress", {
      account: "",
    });
    const transactions = await rpcClient.request("listtransactions", {
      count: 10,
    });

    return Response.json({
      balance,
      address,
      transactions,
    });
  } catch (error) {
    return Response.error();
  }
}
