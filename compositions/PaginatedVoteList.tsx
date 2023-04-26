import React, { useCallback, useMemo, useRef } from 'react';
import { VoteList } from '../components/VoteList';
import { Vote } from '../lib/services/subgraph.service';
import useSWRInfinite from 'swr/infinite';
import { fetcher } from '../lib/util/swr';

type FeedProps = {
  initialVotes?: Vote[];
};

const getKey = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.length) return null; // reached the end
  return `/api/votes?page=${pageIndex + 1}`; // SWR key
};

export function PaginatedVoteList({ initialVotes }: FeedProps) {
  const observer = useRef<IntersectionObserver | null>(null);
  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite(getKey, fetcher, {
      revalidateFirstPage: false,
      fallbackData: initialVotes,
      parallel: true,
    });

  const lastVoteElementRef = useCallback(
    async (node: HTMLDivElement) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(async entries => {
        if (entries[0].isIntersecting) {
          await setSize(size + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [setSize, size]
  );

  const votes = useMemo(() => data?.flat() || [], [data]);

  if (!votes) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <VoteList votes={votes} />
      {isLoading || isValidating ? (
        <h6 className="text-gray-600 text-s">Loading...</h6>
      ) : (
        <div ref={lastVoteElementRef} className="h-4" />
      )}
    </div>
  );
}
