import React, { useMemo } from 'react';
import { Address, useEnsAvatar, useEnsName } from 'wagmi';
import { getEtherscanLink } from '../lib/util/link';
import classNames from 'classnames';
import { useIsMounted } from '../hooks/useIsMounted';

interface VoteReasonProps {
  votes: number;
  address: Address;
  isFor: number;
  reason: string;
  proposalTitle: string;
  proposalId: string;
  block: number;
}

export function VoteReasons({ address }: VoteReasonProps) {
  const isMounted = useIsMounted();
  const { data: rawEnsName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ address });

  const ensName = useMemo(
    () => (rawEnsName ? rawEnsName : address.slice(0, 8)),
    [address, rawEnsName]
  );

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
              className={classNames({
                hidden: !ensAvatar,
              })}
              src={ensAvatar}
              alt={`Ens Avatar for ${address}`}
            />
          </div>
        </a>
      </div>
      <div className="text-gray-400 ">
        <a href={getEtherscanLink(address)} className="hover:underline">
          {ensName}
        </a>
      </div>
    </div>
  );
}

export default VoteReasons;
