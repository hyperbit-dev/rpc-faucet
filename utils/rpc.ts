import Client from "@hyperbitjs/rpc";

const rpcClient = new Client({
  url: process.env.RPC_HOST!,
  username: process.env.RPC_USER!,
  password: process.env.RPC_PASSWORD!,
});

export default rpcClient;
