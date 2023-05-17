import { configureChains, createClient, mainnet } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { getDefaultClient } from 'connectkit';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';

const RPC_URL = 'https://rpc.eth.gateway.fm';
export const { provider, webSocketProvider } = configureChains(
  [mainnet],
  [
    jsonRpcProvider({
      rpc: _ => ({
        http: RPC_URL,
      }),
    }),
  ]
);

export const client = createClient(
  getDefaultClient({
    appName: 'Nouns Vote',
    provider,
    webSocketProvider,
  })
);

export const viem = createPublicClient({
  chain: mainnet,
  transport: http(),
});
