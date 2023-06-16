import Head from 'next/head';
import { FallbackProp } from '../lib/util/swr';
import { SWRConfig } from 'swr';
import React, { useState, useEffect } from 'react';
import HeadSVG from '../public/noun652head.svg';
import Image from 'next/image';
import Link from 'next/link';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { VoteModal } from './VoteModal';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useShowVoteModal } from '../hooks/useShowVoteModal';

type PageProps = {
  title: string;
  children?: JSX.Element;
  fallback?: FallbackProp;
};

export function Page({ children, title: pageTitle, fallback = {} }: PageProps) {
  const { address } = useAccount();
  const [showVote, setShowVote] = useState(false);
  const { showVoteModal, setShowVoteModal } = useShowVoteModal();

  useEffect(() => {
    if (address) {
      setShowVote(true);
    }
  }, [address]);

  const title = pageTitle + ' - voter.wtf';
  return (
    <SWRConfig value={{ fallback }}>
      <main>
        <Head>
          <title>{title}</title>
        </Head>
        <header className="bg-gray-900 md:bg-transparent z-10 fixed top-0 right-0 w-full">
          <div className="flex text-white font-semibold justify-center items-center m-auto md:hidden w-full h-10 green">
            <Link href="https://zora.co/collect/eth:0xdaec0919ca4670e5823753588f3721ad6eaaf3f1">
              Mint and support voter.wtf!
            </Link>
          </div>
          <Link href="/" className="flex justify-between w-full">
            <div className="bg-gray-900 ml-8 justify-start">
              <Image
                src={HeadSVG}
                alt="Noun652 Head"
                className="w-auto h-12"
                width={48}
                height={48}
              />
              <h1 className="neon mb-4 md:mb-0">VwR</h1>
            </div>
            <div className="flex items-center">
              {showVote && (
                <button
                  onClick={() => setShowVoteModal(true)}
                  className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
                >
                  <PencilSquareIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              )}
              <div className="m-4 ml-2 flex justify-end">
                <ConnectButton showBalance={false} />
              </div>
            </div>
          </Link>
        </header>
        {showVoteModal && <VoteModal />}
        <div className="bg-gray-900 min-h-screen text-white font-sans pt-20">
          {children}
        </div>
      </main>
    </SWRConfig>
  );
}
