import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function BarChartCard({ chartData }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 flex flex-col items-center">
      <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">
        Vote Comparison
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="votes" fill="#f97316" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
