import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { config } from '../lib/wagmi';
import { SWRConfig } from 'swr';
import { Analytics } from '@vercel/analytics/react';
import { WagmiConfig, mainnet } from 'wagmi';
import { ActiveProposalsProvider } from '../providers/ActiveProposalsProvider';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import React from 'react';
import { ShowVoteModalProvider } from '../providers/ShowVoteModalProvider';
import { VoteReasonProvider } from '../providers/VoteDetailProvider';

const refreshInterval = 1000 * 60; // 1 minute

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={''}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={[mainnet]} theme={darkTheme()}>
          <SWRConfig
            value={{
              refreshInterval,
              fetcher: (resource, init) =>
                fetch(resource, init).then(res => res.json()),
            }}
          >
            <ActiveProposalsProvider>
              <ShowVoteModalProvider>
                <VoteReasonProvider>
                  <Component {...pageProps} />
                </VoteReasonProvider>
              </ShowVoteModalProvider>
            </ActiveProposalsProvider>
          </SWRConfig>
        </RainbowKitProvider>
      </WagmiConfig>
      <Analytics />
    </div>
  );
}

export default MyApp;
