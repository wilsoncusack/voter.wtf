import React, { useState } from 'react';
import { useNounsDaoLogicV2CastRefundableVoteWithReason as vwr } from '../abis/generated/nounsDAOLogicV2';
import { Proposal } from '../types/Proposal';

export function VoteModal(proposalId: bigint, proposals: Proposal[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProposalId, setSelectedProposalId] =
    useState<bigint>(proposalId);
  const [support, setSupport] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const { data, isLoading, isSuccess, write } = vwr({
    args: [selectedProposalId, support, reason],
  });

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleVote = (support: number) => {
    setSupport(support);
    write();
  };

  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
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
            <h2 className="text-lg leading-6 font-medium text-white">
              Compose Your Vote
            </h2>
            <div className="mt-2">
              <label
                htmlFor="proposal"
                className="block text-sm font-medium text-white"
              >
                Proposal
              </label>
              <select
                id="proposal"
                onChange={e => setSelectedProposalId(BigInt(e.target.value))}
                className="mt-1 block w-full bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {proposals.map(proposal => (
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
                className="mt-1 block w-full bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>For</option>
                <option value={0}>Against</option>
                <option value={-1}>Abstain</option>
              </select>

              <label
                htmlFor="reason"
                className="block text-sm font-medium text-white mt-4"
              >
                Reason
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="mt-1 block w-full bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>
          <div className="bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={() => handleVote(support)}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Vote
            </button>
            <button
              onClick={toggleModal}
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
