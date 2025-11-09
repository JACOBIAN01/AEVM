import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AreaChartCard({ chartData }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 flex flex-col items-center">
      <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">
        Vote Area Chart
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="votes"
            stroke="#f97316"
            fill="#f97316"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
