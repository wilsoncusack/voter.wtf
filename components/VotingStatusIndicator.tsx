import { useNounsDaoLogicV2GetReceipt } from '../abis/generated/nounsDAOLogicV2';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconFill } from '@heroicons/react/24/solid';
import React from 'react';
import { Address } from 'wagmi';

type VotingStatusIndicatorProps = {
  proposalId: bigint;
  address: Address;
};

export function VotingStatusIndicator({
  proposalId,
  address,
}: VotingStatusIndicatorProps) {
  console.log(address);
  const { data, isLoading, isError } = useNounsDaoLogicV2GetReceipt({
    args: [BigInt(proposalId), address],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Error...</div>;
  }

  if (data.hasVoted) {
    return (
      <CheckCircleIconFill
        className="h-5 w-5 text-green-500"
        aria-hidden="true"
      />
    );
  } else {
    return (
      <ExclamationCircleIcon
        className="h-5 w-5 text-orange-500"
        aria-hidden="true"
      />
    );
  }
}
