"use client";

import styles from "./chart.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Sun",
    views: 4000,
    deposits: 2400,
  },
  {
    name: "Mon",
    views: 3000,
    deposits: 1398,
  },
  {
    name: "Tue",
    views: 2000,
    deposits: 3800,
  },
  {
    name: "Wed",
    views: 2780,
    deposits: 3908,
  },
  {
    name: "Thu",
    views: 1890,
    deposits: 4800,
  },
  {
    name: "Fri",
    views: 2390,
    deposits: 3800,
  },
  {
    name: "Sat",
    views: 3490,
    deposits: 4300,
  },
];

const Chart = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Weekly Recap</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip contentStyle={{ background: "#151c2c", border: "none" }} />
          <Legend />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#8884d8"
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="deposits"
            stroke="#82ca9d"
            strokeDasharray="3 4 5 2"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
