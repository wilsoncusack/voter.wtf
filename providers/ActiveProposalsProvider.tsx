import React, { useState, useEffect, FC } from 'react';
import { useBlockNumber } from 'wagmi';
import { subgraphService } from '../lib/services/nounsSubgraph.service';
import { GetActiveProposalsQuery } from '../types/generated/nounsSubgraph';
import { ActiveProposalsContext } from '../contexts/ActiveProposalsContext';

export const ActiveProposalsProvider: FC = ({ children }) => {
  const { data: blockNumber } = useBlockNumber();
  const [proposals, setProposals] = useState<
    GetActiveProposalsQuery['proposals']
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      if (blockNumber == null) return;

      setLoading(true);
      const activeProposals = await subgraphService.getActiveProposals(
        blockNumber.toString()
      );
      setProposals(activeProposals);
      setLoading(false);
    };

    fetchProposals();
  }, [blockNumber]);

  return (
    <ActiveProposalsContext.Provider value={{ proposals, loading }}>
      {children}
    </ActiveProposalsContext.Provider>
  );
};
