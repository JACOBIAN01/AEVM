export default function TotalVotes({ totalVotes }) {
  return (
    <div className="text-center mt-4">
      <p className="text-lg font-medium text-gray-700">
        Total Votes Cast:{" "}
        <span className="font-bold text-orange-700">{totalVotes}</span>
      </p>
    </div>
  );
}
