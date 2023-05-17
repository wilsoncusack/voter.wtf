export interface WeeklyStats {
  vwr: number;
  votes: number;
  voters: number;
}

export default function StatsCard({ stats }: { stats: WeeklyStats }) {
  return (
    <a href="https://dune.com/wilsoncusack/nouns-gov">
      <div className="my-2 bg-gray-00 rounded-lg p-2 mx-5 flex flex-col items-center">
        <p className="text-gray-500"> This Week </p>
        <div className="flex">
          <Stat label="% VwR" value={stats.vwr.toString()} />
          <Stat label="votes" value={stats.votes.toString()} />
          <Stat label="voters" value={stats.voters.toString()} />
        </div>
      </div>
    </a>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col mx-4 items-center">
      <h2 className="text-2xl font-bold text-gray-300">{value}</h2>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}
