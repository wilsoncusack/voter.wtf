import React, { useState, useEffect } from 'react';
import { useNounsDaoLogicV2CastRefundableVoteWithReason as vwr } from '../abis/generated/nounsDAOLogicV2';
import { useActiveProposals } from '../hooks/useActiveProposals';
import { useAccount } from 'wagmi';
import { Markdown } from './Markdown';
import { SupportDetailed } from '../types/Vote';

export function VoteModal({ cancel }: { cancel: () => void }) {
  const { proposals } = useActiveProposals();
  const { address: account } = useAccount();
  const [selectedProposalId, setSelectedProposalId] = useState<string>(
    proposals.length > 0 ? proposals[0].id : ''
  );
  const [support, setSupport] = useState<number>(SupportDetailed.For);
  const [reason, setReason] = useState<string>('\n\n*sent from voter.wtf*');
  const [preview, setPreview] = useState(false);
  const { isLoading, isSuccess, write } = vwr({
    args: [BigInt(selectedProposalId), support, reason],
  });

  const handleVote = (support: number) => {
    setSupport(support);
    write();
  };

  useEffect(() => {
    if (isSuccess) {
      cancel();
    }
  }, [isSuccess, cancel]);

  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto w-full h-full sm:w-auto sm:h-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mt-2">
              <label
                htmlFor="proposal"
                className="block text-sm font-medium text-white"
              >
                Proposal
              </label>
              <select
                id="proposal"
                onChange={e => setSelectedProposalId(e.target.value)}
                className="mt-1 p-2 block w-full bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-2"
              >
                {proposals
                  .filter(
                    proposal =>
                      !proposal.votes.some(
                        vote => vote.voter.id === account?.toLowerCase()
                      )
                  )
                  .map(proposal => (
                    <option
                      key={proposal.id.toString()}
                      value={proposal.id.toString()}
                    >
                      {proposal.title}
                    </option>
                  ))}
              </select>
              <label
                htmlFor="vote"
                className="block text-sm font-medium text-white mt-4"
              >
                Vote
              </label>
              <select
                id="vote"
                onChange={e => setSupport(Number(e.target.value))}
                className="mt-1 p-2 block w-full bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-2"
              >
                <option value={SupportDetailed.For}>For</option>
                <option value={SupportDetailed.Against}>Against</option>
                <option value={SupportDetailed.Abstain}>Abstain</option>
              </select>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-white mt-4"
              >
                Reason
              </label>
              <div className="flex items-center mt-2">
                <button
                  className={`mr-2 p-2 text-white  ${
                    preview ? '' : 'bg-gray-700'
                  }`}
                  onClick={() => setPreview(false)}
                >
                  Edit
                </button>
                <button
                  className={`mr-2 p-2 text-white ${
                    preview ? 'bg-gray-700' : ''
                  }`}
                  onClick={() => setPreview(true)}
                >
                  Preview
                </button>
              </div>
              {!preview && (
                <textarea
                  id="reason"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="p-2 rounded-none block w-full bg-gray-700 text-white shadow-sm h-48"
                ></textarea>
              )}
              {preview && (
                <div
                  className=" p-4 bg-gray-700 text-white shadow-sm h-48 overflow-auto"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  <Markdown text={reason} />
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              disabled={isLoading}
              onClick={() => handleVote(support)}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-gray-800 bg-gray-200 text-base font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {isLoading ? 'Check Wallet' : 'Vote'}
            </button>
            <button
              onClick={cancel}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
