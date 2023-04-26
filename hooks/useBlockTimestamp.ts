import useSWR from 'swr';
import { viem } from '../lib/wagmi';
import { Block } from 'viem';
import { useMemo } from 'react';

export function useBlockTimestamp(blockNumber: bigint) {
  const { data: block, ...rest } = useSWR<Block>(
    ['block', blockNumber],
    ([, blockNumber]) => {
      return viem.getBlock({ blockNumber });
    }
  );

  const data = useMemo(
    () => (block ? parseInt(block.timestamp.toString()) * 1000 : null),
    [block]
  );

  return { data, ...rest };
}
