import { defineConfig } from '@wagmi/cli';
import { etherscan, react } from '@wagmi/cli/plugins';
import { mainnet } from 'wagmi/chains';

export default defineConfig({
  out: 'abis/generated/nouns.ts',
  plugins: [
    etherscan({
      apiKey: '4AXNFGHIUP1MB4XH9TH2C8KCCF471MUWMU',
      chainId: mainnet.id,
      contracts: [
        {
          name: 'NounsDAOLogicV2',
          address: {
            [mainnet.id]: '0x51c7d7c47e440d937208bd987140d6db6b1e4051',
          },
        },
      ],
    }),
    react(),
  ],
});
