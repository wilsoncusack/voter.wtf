import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { WagmiConfig } from 'wagmi';
import { useEffect } from 'react';
import { client } from '../lib/wagmi';
import { SWRConfig } from 'swr';
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultClient,
} from 'connectkit';

const refreshInterval = 1000 * 60; // 1 minute

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    client.autoConnect().then();
  }, []);

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
      <WagmiConfig client={client}>
        <ConnectKitProvider theme="nouns">
          <div className="m-4 flex justify-end">
            <ConnectKitButton />
          </div>
          <SWRConfig
            value={{
              refreshInterval,
              fetcher: (resource, init) =>
                fetch(resource, init).then(res => res.json()),
            }}
          >
            <Component {...pageProps} />
          </SWRConfig>
        </ConnectKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default MyApp;
