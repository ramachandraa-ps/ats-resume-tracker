import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  let color = '#ef4444'; // Red
  if (score > 40) color = '#f59e0b'; // Orange
  if (score > 60) color = '#3b82f6'; // Blue
  if (score > 80) color = '#22c55e'; // Green

  return (
    <div className="relative h-64 w-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={100}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell key="score" fill={color} />
            <Cell key="remaining" fill="#e2e8f0" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 text-center mt-4">
        <span className="text-5xl font-bold text-slate-800">{score}</span>
        <span className="text-xl text-slate-400 font-medium">/100</span>
        <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-wide">ATS Score</p>
      </div>
    </div>
  );
};

export default ScoreGauge;
