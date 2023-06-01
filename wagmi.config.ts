import { defineConfig } from '@wagmi/cli'
import { etherscan, react } from '@wagmi/cli/plugins'
import { mainnet } from 'wagmi/chains'

export default defineConfig({
  out: 'abis/generated/nouns.ts',
  plugins: [
    etherscan({
      apiKey: '4AXNFGHIUP1MB4XH9TH2C8KCCF471MUWMU',
      chainId: mainnet.id,
      contracts: [
        {
          name: 'NounsToken',
          address: {
            [mainnet.id]: '0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03',
          },
        },
      ],
    }),
    react(),
  ],
})
