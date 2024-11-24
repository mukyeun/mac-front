import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function PulseWaveChart({ data }) {
  const chartData = [
    {
      name: '현재',
      수축기혈압: data.수축기혈압 || 0,
      이완기혈압: data.이완기혈압 || 0,
      맥박수: data.맥박수 || 0,
    }
  ];

  return (
    <div className="pulse-wave-chart">
      <h3>맥파 데이터 차트</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="수축기혈압" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
          />
          <Line 
            type="monotone" 
            dataKey="이완기혈압" 
            stroke="#82ca9d" 
          />
          <Line 
            type="monotone" 
            dataKey="맥박수" 
            stroke="#ffc658" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PulseWaveChart;
