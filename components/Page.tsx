import Head from 'next/head';
import { FallbackProp } from '../lib/util/swr';
import { SWRConfig } from 'swr';
import React from 'react';
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
        <header className="text-center">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <Link href="/">
              <div className="flex flex-1 w-full">
                <img
                  src="../noun652head.svg"
                  alt="Noun652 Head"
                  className="w-auto h-32 md:order-2"
                />
                <h1 className="neon mb-4 md:mb-0 md:order-1">
                  Vote with Reason
                </h1>
              </div>
            </Link>
          </div>
        </header>
        <div className="bg-gray-900 min-h-screen text-white font-sans">
          {children}
        </div>
      </main>
    </SWRConfig>
  );
}
