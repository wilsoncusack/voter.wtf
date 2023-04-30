import React, { useMemo, useState } from 'react';
import { Address, useEnsAvatar, useEnsName } from 'wagmi';
import {
  getEtherscanLink,
  getNounsLink,
  replaceURLsWithLink,
} from '../lib/util/link';
import classNames from 'classnames';
import { useIsMounted } from '../hooks/useIsMounted';
import { TimeAgo } from './TimeAgo';
import { useBlockTimestamp } from '../hooks/useBlockTimestamp';
import axios from 'axios';

interface VoteReasonProps {
  votes: number;
  address: Address;
  isFor: number;
  reason: string;
  proposalTitle: string;
  proposalId: string;
  block: number;
}

export function VoteReasons({
  address,
  isFor,
  proposalId,
  proposalTitle,
  votes,
  reason: rawReason,
  block,
}: VoteReasonProps) {
  const isMounted = useIsMounted();
  const { data: rawEnsName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ address });
  const { data: timestamp } = useBlockTimestamp(BigInt(block));
  const [likes, setLikes] = useState(0);

  const ensName = useMemo(
    () => (rawEnsName ? rawEnsName : address.slice(0, 8)),
    [address, rawEnsName]
  );

  const reason = useMemo(
    () => (rawReason ? replaceURLsWithLink(rawReason) : 'no reason :('),
    [rawReason]
  );

  const handleLikeClick = async () => {
    // TODO: Sign the message, get the user address, and replace the placeholders below
    const signedMessage =
      '0xf63ea7932e5527754bb53eb0ec07c9fc8dc77319927a30f33c940d9185831eaa02c53c96aaf78e8229b7974f126390407e8d9176695d0e06fe9b3de4acfaf1ca1b';
    const userAddress = '0xbc3ed6B537f2980e66f396Fe14210A56ba3f72C4';

    const message = `like vote by ${address} on ${proposalId}`;

    try {
      const response = await axios.post('/api/like_vote', {
        prop_id: proposalId,
        voter: address,
        signed_message: signedMessage,
        user: userAddress,
      });

      if (response.status === 200) {
        setLikes(likes + 1);
      }
    } catch (error) {
      console.error('Error liking the vote:', error);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex mb-4 max-w-xl p-4 bg-gray-800 rounded-lg shadow-md">
      <div className="mr-4 w-16 h-16">
        <a href={getEtherscanLink(address)} target="_blank" rel="noreferrer">
          <div
            className={classNames('rounded-full w-16 h-16 overflow-hidden', {
              'avatar-image': !!ensAvatar,
              'bg-gray-700': !ensAvatar,
            })}
          >
            <img
              className={classNames('w-16 h-16', {
                hidden: !ensAvatar,
              })}
              src={ensAvatar}
              alt={`Ens Avatar for ${address}`}
            />
          </div>
        </a>
      </div>
      <div>
        <div className="flex items-center mt-2">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none"
            onClick={handleLikeClick}
          >
            Like
          </button>
          <span className="ml-2 text-gray-400">{likes} likes</span>
        </div>
        <div className="text-gray-400">
          <a
            href={getEtherscanLink(address)}
            className="hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {ensName}
          </a>{' '}
          voted{' '}
          <span
            className={classNames('font-semibold', {
              'text-green-400': isFor == 1,
              'text-red-400': isFor == 0,
              'text-gray-400': isFor !== 1 && isFor !== 0,
            })}
          >
            {isFor == 1 ? 'FOR' : isFor == 0 ? 'AGAINST' : 'ABSTAIN'}{' '}
          </span>
          <span>
            <a
              href={getNounsLink(proposalId)}
              className="hover:underline font-semibold"
              target="_blank"
              rel="noreferrer"
            >
              Proposal {proposalId}: {proposalTitle}{' '}
            </a>
            with {votes} {`vote${votes > 1 ? 's' : ''}`}
          </span>
        </div>
        <div
          className={classNames(
            `whitespace-pre-line break-words overflow-wrap mb-2 mt-2`,
            {
              'text-gray-300': rawReason,
              'text-gray-500': !rawReason,
            }
          )}
          dangerouslySetInnerHTML={{
            __html: reason,
          }}
        />
        <TimeAgo
          className="text-gray-500 text-sm"
          timestamp={timestamp}
          as="div"
        />
      </div>
    </div>
  );
}

export default VoteReasons;
