import { configureChains, createClient, mainnet } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { createPublicClient, http } from 'viem';

export const { provider, webSocketProvider } = configureChains(
  [mainnet],
  [
    jsonRpcProvider({
      rpc: _ => ({
        http: 'https://rpc.eth.gateway.fm',
      }),
    }),
  ]
);

export const client = createClient({
  autoConnect: false,
  provider,
  webSocketProvider,
});

export const viem = createPublicClient({
  chain: mainnet,
  transport: http(),
});
