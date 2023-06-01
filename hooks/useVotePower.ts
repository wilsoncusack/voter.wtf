import { Address, useContractRead } from 'wagmi';
import { nounsTokenABI } from '../abis/generated/nouns';
import { BigNumber } from 'ethers';

export function useVotePower(address: Address, blockNumber: BigNumber) {
  const { data: votePower } = useContractRead({
    abi: nounsTokenABI,
    functionName: 'getPriorVotes',
    args: [address, blockNumber],
  });

  return { votePower };
}
