export default function CandidateTable({ candidates, votes, getPercent }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-auto p-4 min-h-110">
      <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">
        Candidates
      </h2>
      <div className="grid grid-cols-4 bg-orange-100 font-semibold text-gray-700 text-center py-2">
        <div>Image</div>
        <div>Name</div>
        <div>Votes</div>
        <div>%</div>
      </div>
      {candidates.map((c) => {
        const percent = getPercent(votes[c.key]);
        return (
          <div
            key={c.key}
            className="grid grid-cols-4 items-center text-center border-b last:border-none py-2 hover:bg-orange-50 transition-colors"
          >
            <div className="flex justify-center">
              <img
                src={c.img}
                alt={c.name}
                className="w-12 h-12 rounded-full border-2 border-orange-500"
              />
            </div>
            <div className="text-sm md:text-base font-medium">{c.name}</div>
            <div className="font-bold text-orange-700">{votes[c.key]}</div>
            <div className="text-sm text-gray-600">{percent}%</div>
          </div>
        );
      })}
    </div>
  );
}
