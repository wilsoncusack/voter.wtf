import { createConfig, configureChains, mainnet } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import { getDefaultConfig } from 'connectkit';

const RPC_URL = 'https://rpc.eth.gateway.fm';

const { publicClient } = configureChains(
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
    appName: 'voter.wtf',
    publicClient: publicClient,
    chains: [mainnet],
    walletConnectProjectId: '350569e85a7ff1842b079dc92cf87b48',
  })
);

export const viem = createPublicClient({
  chain: mainnet,
  transport: http(),
});
