import { configureChains, createClient, mainnet } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { createPublicClient, http } from 'viem';
import { getDefaultClient } from 'connectkit';

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

// export const client = createClient({
//   autoConnect: false,
//   provider,
//   webSocketProvider,
// });

const alchemyId = process.env.ALCHEMY_ID;

export const client = createClient(
  getDefaultClient({
    appName: 'Nouns Vote',
    alchemyId,
  })
);

export const viem = createPublicClient({
  chain: mainnet,
  transport: http(),
});
