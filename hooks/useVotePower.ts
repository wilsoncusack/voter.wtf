import { Address, useContractRead } from 'wagmi';
import { nounsTokenABI } from '../abis/generated/nouns';

export function useVotePower(address: Address, blockNumber: bigint) {
  const { data: votePower } = useContractRead({
    abi: nounsTokenABI,
    functionName: 'getPriorVotes',
    args: [address, blockNumber],
  });

  return { votePower };
}
