import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { config } from '../lib/wagmi';
import { SWRConfig } from 'swr';
import { ConnectKitProvider } from 'connectkit';
import { Analytics } from '@vercel/analytics/react';
import { WagmiConfig } from 'wagmi';
import { ActiveProposalsProvider } from '../providers/ActiveProposalsProvider';
import React from 'react';

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
        {/* <ConnectKitProvider theme="nouns"> */}
          <SWRConfig
            value={{
              refreshInterval,
              fetcher: (resource, init) =>
                fetch(resource, init).then(res => res.json()),
            }}
          >
            <ActiveProposalsProvider>
              <Component {...pageProps} />
            </ActiveProposalsProvider>
          </SWRConfig>
        {/* </ConnectKitProvider> */}
      </WagmiConfig>
      <Analytics />
    </div>
  );
}

export default MyApp;
