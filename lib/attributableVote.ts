import { SupportDetailed } from '../types/Vote';
import { nounsDaoLogicV2ABI } from '../abis/generated/nounsDAOLogicV2';
import { viem } from './wagmi';
import { WalletClient, getFunctionSelector } from 'viem';
import { useTransaction, useWalletClient } from 'wagmi';

export const vote = async (
  wallet: WalletClient,
  proposalId: bigint,
  support: SupportDetailed,
  reason: string
) => {
  console.log('def here');
  const { request } = await viem.simulateContract({
    address: '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d',
    abi: nounsDaoLogicV2ABI,
    functionName: 'castRefundableVoteWithReason',
    args: [proposalId, support, reason],
    dataSuffix: '0xdeadbeef',
  });
  console.log(request.dataSuffix);
  request.dataSuffix = getFunctionSelector('voter.wtf');
  console.log(request.dataSuffix);
  const hash = await wallet.writeContract(request);
  console.log('hash', hash);
};
