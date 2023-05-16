import { createClient, mainnet } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { getDefaultClient } from 'connectkit';

// can be public for client use - prod key needs URL whitelist
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID;

export const client = createClient(
  getDefaultClient({
    appName: 'Nouns Vote',
    alchemyId,
  })
);

export const viem = createPublicClient({
  chain: mainnet,
  transport: http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`),
});
