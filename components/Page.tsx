import Head from 'next/head';
import { FallbackProp } from '../lib/util/swr';
import { SWRConfig } from 'swr';
import React from 'react';
import { ConnectKitButton } from 'connectkit';
import HeadSVG from '../public/noun652head.svg';
import Image from 'next/image';
import Link from 'next/link';

type PageProps = {
  title: string;
  children?: JSX.Element;
  fallback?: FallbackProp;
};

export function Page({ children, title: pageTitle, fallback = {} }: PageProps) {
  const title = pageTitle + ' - Nounsvote.wtf';
  return (
    <SWRConfig value={{ fallback }}>
      <main>
        <Head>
          <title>{title}</title>
        </Head>
        <Link href="/" className="flex justify-between w-full">
          <div className="ml-8 justify-start">
            <Image
              src={HeadSVG}
              alt="Noun652 Head"
              className="w-auto h-12"
              width={48}
              height={48}
            />
            <h1 className="neon mb-4 md:mb-0">VwR</h1>
          </div>
          <div className="m-4 flex justify-end">
            <ConnectKitButton />
          </div>
        </Link>
        <div className="bg-gray-900 min-h-screen text-white font-sans">
          {children}
        </div>
      </main>
    </SWRConfig>
  );
}
