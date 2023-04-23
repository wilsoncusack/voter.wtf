import React, { useCallback, useEffect, useState } from 'react';
import { Address, useEnsName, useEnsAvatar } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

interface VoteReasonProps {
  votes: number;
  address: string;
  isFor: number;
  reason: string;
  proposalTitle: string;
  proposalId: string;
  block: number;
}

const timeAgo = (timestamp: number): string => {
  const now = new Date();
  const timeDifference = Math.floor((now.getTime() - timestamp) / 1000);

  const units: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, seconds] of Object.entries(units)) {
    const count = Math.floor(timeDifference / seconds);
    if (count >= 1) {
      return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

const VoteReasons: React.FC<VoteReasonProps> = ({
  votes,
  address,
  isFor,
  reason,
  block,
  proposalTitle,
  proposalId,
}) => {
  const ensName = useEnsName({
    address: address as Address,
  });
  const ensAvatar = useEnsAvatar({
    address: address as Address,
  });
  const [timestamp, setTimestamp] = useState('');

  interface Block {
    timestamp: bigint;
  }

  const getTimestamp = useCallback(async () => {
    const blockInfo: Block = await client.getBlock({
      blockNumber: BigInt(block),
    });
    setTimestamp(timeAgo(parseInt(blockInfo.timestamp.toString()) * 1000));
  }, [block]);

  useEffect(() => {
    getTimestamp();
  }, [getTimestamp]);

  return (
    <div className="flex mb-4 p-4 bg-gray-800 rounded-lg shadow-md">
      <div className="mr-4">
        <a href={`https://etherscan.io/address/${address}`}>
          {ensAvatar.data ? (
            <img
              src={ensAvatar.data}
              className="w-16 min-w-16 min-h-16 h-16 bg-gray-700 rounded-full"
            />
          ) : (
            <div className="w-16 h-16  bg-gray-700 rounded-full"></div>
          )}
        </a>
      </div>
      <div>
        <p className="text-gray-400 font-semibold">
          <a
            href={`https://etherscan.io/address/${address}`}
            className="hover:underline"
          >
            {ensName.data ? ensName.data : address.slice(0, 8)}
          </a>
          <span> voted </span>
          <span
            className={`font-semibold ${
              isFor == 1
                ? 'text-green-400'
                : isFor == 0
                ? 'text-red-400'
                : 'text-gray-500'
            }`}
          >
            {isFor == 1 ? 'FOR' : isFor == 0 ? 'AGAINST' : 'ABSTAIN'}
          </span>
          <span>
            {' '}
            <a
              href={`https://nouns.wtf/vote/${proposalId}`}
              className="hover:underline"
            >
              {' '}
              Proposal {proposalId}: {proposalTitle}
            </a>{' '}
            with{' '}
          </span>
          <span>
            {' '}
            {votes} {votes == 1 ? 'vote' : 'votes'}{' '}
          </span>
        </p>
        <p
          className={`whitespace-pre-line ${
            reason ? 'text-gray-300' : 'text-gray-500'
          }`}
        >
          {reason ? reason : 'no reason :('}
        </p>
        <p className="text-gray-500 text-sm">{timestamp}</p>
      </div>
    </div>
  );
};

export default VoteReasons;
