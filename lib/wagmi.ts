import { createConfig, configureChains, mainnet } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import { getDefaultConfig } from 'connectkit';

const RPC_URL = 'https://rpc.eth.gateway.fm';

const { provider } = configureChains(
  [mainnet],
  [
    jsonRpcProvider({
      rpc: _ => ({
        http: RPC_URL,
      }),
    }),
  ]
);

export const config = createConfig(
  getDefaultConfig({
    provider: provider,

    // Required
    appName: 'Your App Name',

    // Optional
    appDescription: 'A Nouns Voting Console',
    appUrl: 'https://voter.wtf',
    appLogo: '/public/noun652head.svg',
  })
);

export const viem = createPublicClient({
  chain: mainnet,
  transport: http(),
});
