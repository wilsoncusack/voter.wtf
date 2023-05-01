export type VoteType = 'for' | 'against';
interface MobileForAgainstToggle {
  setMobileVoteType: (type: VoteType) => void;
  mobileVoteType: VoteType;
}

export function MobileForAgainstToggle({
  setMobileVoteType,
  mobileVoteType,
}: MobileForAgainstToggle) {
  return (
    <div className="w-full md:hidden flex justify-center my-4">
      <button
        className={`bg-gray-700 text-white px-4 py-2 rounded-l-md focus:outline-none ${
          mobileVoteType === 'for' ? 'bg-gray-800' : ''
        }`}
        onClick={() => setMobileVoteType('for')}
      >
        For
      </button>
      <button
        className={`bg-gray-700 text-white px-4 py-2 rounded-r-md focus:outline-none ${
          mobileVoteType === 'against' ? 'bg-gray-800' : ''
        }`}
        onClick={() => setMobileVoteType('against')}
      >
        Against
      </button>
    </div>
  );
}
