import React, { useCallback, useEffect, useState } from 'react';
import { ProposalContainer } from '../components/ProposalsContainer';
import { SelectedProposalVoteView } from '../compositions/SelectedProposalVoteView';
import { getKey, PaginatedVoteList } from '../compositions/PaginatedVoteList';
import { FallbackProp } from '../lib/util/swr';
import { viem } from '../lib/wagmi';
import { unstable_serialize } from 'swr/infinite';
import { Proposal, ProposalStatus } from '../types/Proposal';
import axios from 'axios';
import { getActiveProposals } from '../lib/proposals';
import { getNounsLink } from '../lib/util/link';
import { Page } from '../components/Page';
import StatsCard, { WeeklyStats } from '../components/StatsCard';
import { weeklyStats } from '../lib/stats';
import { getVotes, getVotesForProposal } from '../lib/votes';
import { OrderDirection } from '../types/generated/nounsSubgraph';
import { useRouter } from 'next/router';
import '@rainbow-me/rainbowkit/styles.css';
import PromoCard from '../components/PromoCard';

type HomePageProps = {
  fallback: FallbackProp;
  openProposals: Proposal[];
  stats: WeeklyStats;
};

export enum ProposalsToggleType {
  Active = 'active',
  All = 'all',
}

export default function Home({
  openProposals,
  fallback,
  stats,
}: HomePageProps) {
  const router = useRouter();
  const { proposalId } = router.query;
  const parsedProposalId = proposalId as string;

  const [clearSelectedProposal, setClearSelectedProposal] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>(openProposals);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [proposalsType, setProposalsType] = useState<ProposalsToggleType>(
    ProposalsToggleType.Active
  );

  const setSelectedProposalAndUpdateURL = useCallback(
    (proposal: Proposal | null) => {
      setSelectedProposal(proposal);

      // If a proposal is selected, add it to the URL's query parameters.
      // Otherwise, remove the 'proposalId' query parameter.
      if (proposal) {
        router.push(
          {
            pathname: router.pathname,
            query: { ...router.query, proposalId: proposal.id.toString() },
          },
          undefined,
          { shallow: true }
        );
      } else {
        const { proposalId, ...rest } = router.query; // remove proposalId from query

        router.push(
          {
            pathname: router.pathname,
            query: rest,
          },
          undefined,
          { shallow: true }
        );
        setClearSelectedProposal(true);
      }
    },
    [router]
  );

  useEffect(() => {
    if (clearSelectedProposal) {
      setClearSelectedProposal(false);
    }
  }, [proposalId]);

  const toggleProposalsType = useCallback(
    (type: ProposalsToggleType) => {
      console.log(type);
      if (
        type === ProposalsToggleType.Active &&
        proposalsType == ProposalsToggleType.All &&
        !openProposals.find(
          proposal => proposal.id.toString() === parsedProposalId
        )
      ) {
        router.push('');
        setSelectedProposalAndUpdateURL(null);
      }

      setProposalsType(type);
    },
    [
      openProposals,
      parsedProposalId,
      proposalsType,
      setSelectedProposalAndUpdateURL,
      router,
    ]
  );

  useEffect(() => {
    if (
      parsedProposalId === undefined ||
      selectedProposal ||
      clearSelectedProposal
    )
      return;
    const initialSelectedProposal =
      openProposals.find(
        proposal => proposal.id.toString() === parsedProposalId
      ) || null;
    if (!initialSelectedProposal && proposalsType === 'active') {
      setProposalsType(ProposalsToggleType.All);
    } else {
      setSelectedProposal(initialSelectedProposal);
    }
  }, [
    openProposals,
    parsedProposalId,
    proposalsType,
    selectedProposal,
    clearSelectedProposal,
  ]);

  useEffect(() => {
    let isCancelled = false; // To prevent setting state if component unmounts

    const fetchProposals = async () => {
      if (proposalsType === ProposalsToggleType.Active) {
        if (!isCancelled) setProposals(openProposals);
      } else {
        const block = await viem.getBlockNumber();
        const proposalsResp = await axios.get('/api/proposals', {
          params: {
            currentBlock: block.toString(),
            startBlockLimit: (block + BigInt(100000)).toString(),
            endBlockLimit: 0,
            order: 'desc',
            limit: 400,
            offset: 0,
          },
        });
        const allProposals = proposalsResp.data;
        if (!isCancelled) setProposals(allProposals);
        if (parsedProposalId && !selectedProposal) {
          const initialSelectedProposal =
            allProposals.find(
              (proposal: Proposal) =>
                proposal.id.toString() === parsedProposalId
            ) || null;
          if (!initialSelectedProposal) {
            setSelectedProposal(null);
          } else {
            setSelectedProposal(initialSelectedProposal);
          }
        }
      }
    };

    fetchProposals(); // Call the async function

    return () => {
      isCancelled = true; // If component unmounts, mark as cancelled
    };
  }, [proposalsType, openProposals, parsedProposalId, selectedProposal]);

  return (
    <Page title="Home" fallback={fallback}>
      <div className="md:flex bg-gray-900 min-h-screen text-white font-sans">
        <div className="md:fixed md:bottom-0 md:top-100  md:w-1/3 mt-12">
          <ProposalContainer
            proposals={proposals}
            selectedProposal={selectedProposal}
            setSelectedProposal={setSelectedProposalAndUpdateURL}
            selectedProposalsToggle={proposalsType}
            toggleProposalsType={toggleProposalsType}
          />
        </div>
        <div className="flex md:w-2/3 md:ml-auto relative">
          <div className={selectedProposal ? '' : 'md:w-2/3'}>
            <h1 className="text-3xl font-semibold  m-4 px-2 pt-2">
              {selectedProposal ? (
                <a
                  href={getNounsLink(selectedProposal.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {selectedProposal.id}: {selectedProposal.title}
                </a>
              ) : (
                'Vote Timeline'
              )}
            </h1>
            <div className="flex flex-wrap justify-left m-4">
              {selectedProposal ? (
                <SelectedProposalVoteView selectedProposal={selectedProposal} />
              ) : (
                <div>
                  <PaginatedVoteList />
                </div>
              )}
            </div>
          </div>
          {!selectedProposal && (
            <div className="hidden md:block fixed right-0 top-20">
              <StatsCard stats={stats} />
              <PromoCard
                description="mint and support voter.wtf"
                imageUrl="public/noun652.svg"
                url="https://zora.co/collect/eth:0xdaec0919ca4670e5823753588f3721ad6eaaf3f1"
                buttonText="Mint and support voter.wtf!"
              />
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}

export async function getStaticProps() {
  const votes = await getVotes({
    order: OrderDirection.Desc,
    limit: 10,
    offset: 0,
  });
  const block = await viem.getBlockNumber();
  let proposals = await getActiveProposals(block);

  proposals = proposals.filter(
    proposal => proposal.status != ProposalStatus.Cancelled
  );

  const prefetchedVotes = await Promise.all(
    proposals
      .slice(0, 3)
      .map(p => getVotesForProposal(p.id, OrderDirection.Desc))
  );

  const voteFallback = prefetchedVotes.reduce((acc, votes, idx) => {
    const key = proposals[idx].id;
    return {
      ...acc,
      [`/api/proposals/${key}/votes`]: votes,
    };
  }, {});

  return {
    props: {
      openProposals: proposals,
      fallback: {
        [unstable_serialize(getKey)]: votes,
        ...voteFallback,
      },
      stats: await weeklyStats(),
    },
    revalidate: 10,
  };
}
