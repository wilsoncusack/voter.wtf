import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { WagmiConfig } from 'wagmi';
import { useEffect } from 'react';
import { client } from '../lib/wagmi';

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
        <Component {...pageProps} />
      </WagmiConfig>
    </div>
  );
}

export default MyApp;
