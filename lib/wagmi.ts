import { createConfig, configureChains, mainnet } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

const RPC_URL = 'https://rpc.eth.gateway.fm';

const { chains, publicClient } = configureChains(
  [mainnet],
  [
    jsonRpcProvider({
      rpc: _ => ({
        http: RPC_URL,
      }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'voter.wtf',
  projectId: '350569e85a7ff1842b079dc92cf87b48',
  chains,
});

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export const viem = createPublicClient({
  chain: mainnet,
  transport: http(),
});
