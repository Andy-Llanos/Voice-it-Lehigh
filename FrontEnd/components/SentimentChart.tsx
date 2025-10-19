
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FeedbackItem, Sentiment } from '../types';

interface SentimentChartProps {
  data: FeedbackItem[];
}

const COLORS = {
  [Sentiment.POSITIVE]: '#10B981', // Emerald 500
  [Sentiment.NEGATIVE]: '#EF4444', // Red 500
  [Sentiment.NEUTRAL]: '#6B7280',  // Gray 500
};

const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const counts = {
      [Sentiment.POSITIVE]: 0,
      [Sentiment.NEGATIVE]: 0,
      [Sentiment.NEUTRAL]: 0,
    };
    data.forEach(item => {
      counts[item.sentiment]++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  const total = data.length;

  if (total === 0) {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-lehigh-brown mb-2">Sentiment Overview</h3>
            <div className="h-48 flex items-center justify-center text-gray-500">No data for chart</div>
        </div>
    )
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-lehigh-brown mb-2">Sentiment Overview</h3>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as Sentiment]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentChart;
