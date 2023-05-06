import React, { useEffect, useMemo, useState } from 'react';
import {
  Address,
  useEnsAvatar,
  useEnsName,
  useSigner,
  useAccount,
} from 'wagmi';
import {
  getEtherscanLink,
  getNounsLink,
  replaceURLsWithLink,
} from '../lib/util/link';
import { clsx as classNames } from 'clsx';
import { useIsMounted } from '../hooks/useIsMounted';
import { TimeAgo } from './TimeAgo';
import { useBlockTimestamp } from '../hooks/useBlockTimestamp';
import axios from 'axios';
import Image from 'next/image';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid';
import { Like } from '../lib/types/VoteWithLikes';

interface VoteReasonProps {
  votes: number;
  address: Address;
  isFor: number;
  reason: string;
  proposalTitle: string;
  proposalId: string;
  block: number;
  nounHolderLikes: Like[];
  nonNounHolderLikes: Like[];
}

export function VoteReasons({
  address,
  isFor,
  proposalId,
  proposalTitle,
  votes,
  reason: rawReason,
  block,
  nounHolderLikes,
  nonNounHolderLikes,
}: VoteReasonProps) {
  const isMounted = useIsMounted();
  const { data: rawEnsName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ address });
  const { data: timestamp } = useBlockTimestamp(BigInt(block));
  const { data: signer } = useSigner();
  const { address: account } = useAccount();
  const [liked, setLiked] = useState(false);

  const ensName = useMemo(
    () => (rawEnsName ? rawEnsName : address.slice(0, 8)),
    [address, rawEnsName]
  );

  const reason = useMemo(
    () => (rawReason ? replaceURLsWithLink(rawReason) : ''),
    [rawReason]
  );

  const handleLikeClick = async () => {
    if (liked) {
      return;
    }

    const message = `like vote by ${address} on ${proposalId}`;

    try {
      const signedMessage = await signer.signMessage(message);
      const response = await axios.post('/api/likeVote', {
        prop_id: proposalId,
        voter: address,
        signed_message: signedMessage,
        user: account,
      });

      if (response.status === 200) {
        setLiked(true);
        // TODO pass in some isNounHolder from the top level
        // and update vote count based on this
      }
    } catch (error) {
      console.error('Error liking the vote:', error);
    }
  };

  useEffect(() => {
    if (!account || !nonNounHolderLikes || !nounHolderLikes) return;

    if (
      nounHolderLikes.find(like => like.user === account) ||
      nonNounHolderLikes.find(like => like.user === account)
    ) {
      setLiked(true);
    }
  }, [account, nonNounHolderLikes, nounHolderLikes]);

  if (!isMounted) return null;

  return (
    <div
      className={`flex mb-4 p-4 ${
        reason != '' ? 'bg-gray-800' : ''
      } rounded-lg shadow-md`}
    >
      {reason != '' && (
        <div className="mr-4">
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
          <div>
            <div className={'flex mt-4 justify-center'}>
              {nounHolderLikes && nounHolderLikes.length > 0 && (
                <>
                  <Image
                    height={30}
                    width={30}
                    alt="test"
                    src="/nounHeart.svg"
                  />
                  <p className="text-gray-500 font-semibold">
                    {' '}
                    {nounHolderLikes.length}{' '}
                  </p>
                </>
              )}
            </div>
            {nonNounHolderLikes && nonNounHolderLikes.length > 0 && (
              <>
                <div className={'flex justify-center'}>
                  <SolidHeartIcon
                    height={25}
                    width={25}
                    className="ml-1 text-gray-500"
                  />
                  <p className="ml-1 text-gray-500 font-semibold">
                    {' '}
                    {nonNounHolderLikes.length}{' '}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <div>
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
        {reason != '' && (
          <div className={'flex justify-end'}>
            <button
              onClick={handleLikeClick}
              disabled={!signer || liked}
              className={`p-2 ${
                liked
                  ? ''
                  : 'transition duration-300 ease-in-out hover:bg-red-500 rounded-full'
              }`}
            >
              {liked ? (
                <Image
                  height={30}
                  width={30}
                  alt="test"
                  src="/coloredNounHeart.svg"
                />
              ) : (
                <Image height={30} width={30} alt="test" src="/nounHeart.svg" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoteReasons;
