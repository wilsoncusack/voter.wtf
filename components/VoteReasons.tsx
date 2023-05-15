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
import { Like, Vote } from '../types/Vote';

interface VoteReasonProps {
  vote: Vote;
}

export function VoteReasons({ vote }: VoteReasonProps) {
  const isMounted = useIsMounted();
  const { data: rawEnsName } = useEnsName({
    address: vote.voter.id as Address,
  });
  const { data: ensAvatar } = useEnsAvatar({
    address: vote.voter.id as Address,
  });
  const { data: timestamp } = useBlockTimestamp(BigInt(vote.blockNumber));
  const { data: signer } = useSigner();
  const { address: account } = useAccount();
  const [liked, setLiked] = useState(false);
  const [voterLikes, setVoterLikes] = useState<Like[]>([]);
  const [nonVoterLikes, setNonVoterLikes] = useState<Like[]>([]);

  const ensName = useMemo(
    () => (rawEnsName ? rawEnsName : vote.voter.id.slice(0, 8)),
    [vote.voter, rawEnsName]
  );

  const reason = useMemo(
    () => (vote.reason ? replaceURLsWithLink(vote.reason) : ''),
    [vote.reason]
  );

  const handleLikeClick = async () => {
    if (liked) {
      return;
    }

    const message = `like vote by ${vote.voter.id} on ${vote.proposal.id}`;

    try {
      const signedMessage = await signer.signMessage(message);
      const response = await axios.post('/api/likeVote', {
        prop_id: vote.proposal.id,
        voter: vote.voter.id,
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
    if (!account || !vote.likes) return;

    const vLikes = [];
    const nVLikes = [];

    for (const like of vote.likes) {
      if (like.is_nouns_voter) {
        vLikes.push(like);
      } else {
        nVLikes.push(like);
      }
      if (like.user === account) {
        setLiked(true);
      }
    }

    setVoterLikes(vLikes);
    setNonVoterLikes(nVLikes);
  }, [account, vote.likes]);

  if (!isMounted) return null;

  return (
    <div
      className={`flex p-4 mb-2 ${
        reason != '' ? 'bg-gray-800' : ''
      } rounded-lg shadow-md`}
    >
      {reason != '' && (
        <div className="mr-4">
          <a
            href={getEtherscanLink(vote.voter.id as Address)}
            target="_blank"
            rel="noreferrer"
          >
            <div
              className={classNames('rounded-full w-12 h-12 overflow-hidden', {
                'avatar-image': !!ensAvatar,
                'bg-gray-700': !ensAvatar,
              })}
            >
              <img
                className={classNames('w-12 h-12', {
                  hidden: !ensAvatar,
                })}
                src={ensAvatar}
                alt={`Ens Avatar for ${vote.voter.id}`}
              />
            </div>
          </a>
          <div>
            <div className={'flex mt-4 justify-center'}>
              {voterLikes.length > 0 && (
                <>
                  <Image
                    height={30}
                    width={30}
                    alt="test"
                    src="/nounHeart.svg"
                  />
                  <p className="text-gray-500 font-semibold">
                    {' '}
                    {voterLikes.length}{' '}
                  </p>
                </>
              )}
            </div>
            {nonVoterLikes.length > 0 && (
              <>
                <div className={'flex justify-center'}>
                  <SolidHeartIcon
                    height={25}
                    width={25}
                    className="ml-1 text-gray-500"
                  />
                  <p className="ml-1 text-gray-500 font-semibold">
                    {' '}
                    {nonVoterLikes.length}{' '}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <div>
        <div className="text-gray-300">
          <a
            href={getEtherscanLink(vote.voter.id as Address)}
            className="hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {ensName}
          </a>
          {': '}
          <span
            className={classNames('font-semibold', {
              'text-green-400': vote.supportDetailed == 1,
              'text-red-400': vote.supportDetailed == 0,
              'text-gray-400':
                vote.supportDetailed !== 1 && vote.supportDetailed !== 0,
            })}
          >
            {' '}
            <span className=" w-5 rounded-full ">{vote.votes} </span>
            {vote.supportDetailed == 1
              ? 'FOR'
              : vote.supportDetailed == 0
              ? 'AGAINST'
              : 'ABSTAIN'}{' '}
          </span>
        </div>
        <a
          href={getNounsLink(vote.proposal.id)}
          className="hover:underline text-gray-400 text-sm line-clamp-1"
          target="_blank"
          rel="noreferrer"
        >
          Prop {vote.proposal.id}: {vote.proposal.title}{' '}
        </a>
        <div
          className={classNames(
            `whitespace-pre-line break-words overflow-wrap mb-2 mt-2`,
            {
              'text-gray-300': vote.reason,
              'text-gray-500': !vote.reason,
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
