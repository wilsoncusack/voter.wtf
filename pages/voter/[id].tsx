import { Page } from '../../components/Page';
import { subgraphService } from '../../lib/services/subgraph.service';
import { GetStaticProps } from 'next';
import { getAddress, isAddress } from 'viem';
import { useVotesForAddress } from '../../hooks/useVotesForAddress';
import { VoteList } from '../../components/VoteList';
import { FallbackProp } from '../../lib/util/swr';
import { useRouter } from 'next/router';

type VoterPageProps = {
  address: string;
  fallback: FallbackProp;
};

type VoterPageParams = {
  id: string;
};

export default function Voter({ fallback, address }: VoterPageProps) {
  const { votes = [] } = useVotesForAddress(address);

  const { isFallback } = useRouter();

  return (
    <Page title="Voter" fallback={fallback}>
      <section>
        <h1>{address}</h1>
        {isFallback ? <h5>loading</h5> : <VoteList votes={votes} />}
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
  let address = params.id;
  if (params.id.includes('.eth')) {
    // TODO - fetch ens name
    throw new Error('Not Implemented');
  } else {
    const isValid = isAddress(address);
    if (!isValid) {
      throw new Error('supplied id is not a valid address or ens name');
    }
    // TODO - we check before call to avoid unhandled / badly messaged error
    address = getAddress(address);
  }
  const votes = await subgraphService.getVotes({
    order: 'desc',
    voterId: address,
  });

  return {
    props: {
      address,
      fallback: {
        [`/api/votes?voterId=${address}`]: votes,
      },
    },
    revalidate: 30,
  };
};
