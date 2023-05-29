import React, { useEffect, useMemo, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import { getNounsLink, replaceURLsWithLink } from '../lib/util/link';
import { clsx as classNames } from 'clsx';
import { useIsMounted } from '../hooks/useIsMounted';
import { TimeAgo } from './TimeAgo';
import { useBlockTimestamp } from '../hooks/useBlockTimestamp';
import axios from 'axios';
import Image from 'next/image';
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid';
import { Like, Vote } from '../types/Vote';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface VoteReasonProps {
  vote: Vote;
}

export function VoteReasons({ vote }: VoteReasonProps) {
  const isMounted = useIsMounted();
  const { data: timestamp } = useBlockTimestamp(BigInt(vote.blockNumber));
  const { data: signer } = useSigner();
  const { address: account } = useAccount();
  const [liked, setLiked] = useState(false);
  const [voterLikes, setVoterLikes] = useState<Like[]>([]);
  const [nonVoterLikes, setNonVoterLikes] = useState<Like[]>([]);

  const ensName = useMemo(
    () => (vote.voter.ensName ? vote.voter.ensName : vote.voter.id.slice(0, 8)),
    [vote.voter.id, vote.voter.ensName]
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
      setLiked(true);
      // TODO pass in some isNounHolder from the top level
      // and update vote count based on this
      const response = await axios.post('/api/likeVote', {
        prop_id: vote.proposal.id,
        voter: vote.voter.id,
        signed_message: signedMessage,
        user: account,
      });

      if (response.status != 200) {
        setLiked(false);
      }
    } catch (error) {
      setLiked(false);
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
          <Link href={`/voters/${encodeURIComponent(vote.voter.id)}`}>
            <div
              className={classNames(
                'rounded-full w-12 h-12 overflow-hidden transition-all border-transparent border-2 duration-100 hover:border-gray-500 box-border bg-gray-700'
              )}
            >
              {vote.voter.ensAvatar && <EnsImage url={vote.voter.ensAvatar} />}
            </div>
          </Link>
          <div>
            <div className="flex mt-4 justify-center">
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
          <Link
            className="hover:underline"
            href={`/voters/${encodeURIComponent(vote.voter.id)}`}
          >
            {ensName}
          </Link>
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
        <div className="whitespace-pre-line break-words overflow-wrap mb-2 mt-2 text-gray-200">
          <ReactMarkdown
            components={{
              a: ({ ...props }) => (
                <a
                  style={{
                    wordBreak: 'break-word',
                    textDecoration: 'underline',
                  }}
                  {...props}
                />
              ),
              blockquote: ({ ...props }) => (
                <blockquote
                  className="pl-4 border-l-4 border-gray-400 italic"
                  {...props}
                />
              ),
              p: ({ children, ...props }) => {
                const newChildren = [];
                children.forEach(child => {
                  if (typeof child === 'string') {
                    const parts = child.split(' ');
                    parts.forEach((part, index) => {
                      if (part.length > 15) {
                        newChildren.push(
                          <span style={{ wordBreak: 'break-all' }}>{part}</span>
                        );
                      } else {
                        newChildren.push(part);
                      }
                      if (index !== parts.length - 1) {
                        newChildren.push(' ');
                      }
                    });
                  } else {
                    newChildren.push(child);
                  }
                });
                return <p {...props}>{newChildren}</p>;
              },
              code: ({ inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <pre style={{ whiteSpace: 'pre-wrap' }} {...props}>
                    <code className={`language-${match[1]}`}>{children}</code>
                  </pre>
                ) : (
                  <code style={{ whiteSpace: 'pre-wrap' }} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {vote.reason}
          </ReactMarkdown>
        </div>
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

function EnsImage({ url }) {
  const [error, setError] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    setImageUrl('/api/image?url=' + encodeURIComponent(url));
  }, [url]);

  const handleError = () => {
    setError(true);
  };

  return error ? (
    <div className="rounded-full w-12 h-12 bg-gray-700"></div>
  ) : (
    <Image
      src={imageUrl}
      width={48}
      height={48}
      alt={`Ens Avatar`}
      onError={handleError}
    />
  );
}
