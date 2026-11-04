export const nearConfig = {
  networkId: process.env.NEXT_PUBLIC_NEAR_NETWORK ?? "testnet",
  rpcUrl: process.env.NEAR_RPC_URL ?? "https://rpc.testnet.near.org",
  contractId: process.env.NEXT_PUBLIC_LUME_CONTRACT_ID ?? "",
  tokenContractId: process.env.NEAR_TOKEN_CONTRACT_ID ?? "",
};

export function assertNearConfiguration() {
  if (!nearConfig.contractId || !nearConfig.tokenContractId) {
    throw new Error("NEAR contract configuration is incomplete");
  }
}

