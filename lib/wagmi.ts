import { configureChains, createClient, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { createPublicClient, http } from 'viem';

export const { provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()]
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
