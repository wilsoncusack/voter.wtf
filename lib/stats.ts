import axios from 'axios';

export const weeklyStats = async () => {
  const vwrResponse = await axios.get(
    `https://api.dune.com/api/v1/query/2428767/results?api_key=${process.env.DUNE_API_KEY}`
  );
  const vwrLastWeek =
    vwrResponse.data['result']['rows'][0]['percent of votes with reason'];

  const votesResponse = await axios.get(
    `https://api.dune.com/api/v1/query/2428801/results?api_key=${process.env.DUNE_API_KEY}`
  );
  const row = votesResponse.data['result']['rows'][0];
  const votesLastWeek = row['no_reason_count'] + row['reason_count'];

  const voters = await axios.get(
    `https://api.dune.com/api/v1/query/2428807/results?api_key=${process.env.DUNE_API_KEY}`
  );
  const votersLastWeek = voters.data['result']['rows'][0]['unique_voters'];

  return {
    vwr: parseFloat(vwrLastWeek),
    votes: votesLastWeek,
    voters: votersLastWeek,
  };
};
