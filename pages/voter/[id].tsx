import { Page } from '../../components/Page';
import { subgraphService } from '../../lib/services/subgraph.service';
import { GetStaticProps } from 'next';
import { getAddress, isAddress } from 'viem';
import { useVotesForAddress } from '../../hooks/useVotesForAddress';
import { VoteList } from '../../components/VoteList';
import { FallbackProp } from '../../lib/util/swr';
import { useRouter } from 'next/router';
import { viem } from '../../lib/wagmi';
import { formatAddress } from '../../lib/util/format';
import { Address } from 'wagmi';

type VoterPageProps = {
  address: Address;
  ensName: string | null;
  fallback: FallbackProp;
};

type VoterPageParams = {
  id: Address | string;
};

export default function Voter({ fallback, address, ensName }: VoterPageProps) {
  const { votes = [] } = useVotesForAddress(address);
  const { isFallback } = useRouter();

  if (isFallback) {
    return <Page title="Votes" />;
  }

  const name = ensName || formatAddress(address);

  return (
    <Page title={`${name} Votes`} fallback={fallback}>
      <section>
        <h1>{name}</h1>
        <VoteList votes={votes} />
      </section>
    </Page>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps<
  VoterPageProps,
  VoterPageParams
> = async context => {
  const params = context.params;
  let address: Address = params.id as Address;
  let ensName;
  if (params.id.includes('.eth')) {
    address = await viem.getEnsAddress({
      name: params.id,
    });
    ensName = params.id;
  } else {
    const isValid = isAddress(address);
    if (!isValid) {
      throw new Error('supplied id is not a valid address or ens name');
    }
    address = getAddress(address);
    ensName = await viem.getEnsName({
      address,
    });
  }
  const votes = await subgraphService.getVotes({
    order: 'desc',
    voterId: address,
  });

  return {
    props: {
      address,
      ensName,
      fallback: {
        [`/api/votes?voterId=${address}`]: votes,
      },
    },
    revalidate: 30,
  };
};
