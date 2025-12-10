import React, { useMemo } from "react";
import { Tooltip, ResponsiveContainer,CartesianGrid, XAxis, YAxis, BarChart, Legend, Bar} from "recharts";
import "./Yearly.css";

const revenueByYear = {
  2022: [30,45,40,55,70,60,75,95,85,100,120,110],
  2023: [38,52,48,70,85,72,90,105,98,118,135,128],
  2024: [45,60,50,75,90,80,95,110,98,120,140,130],
};

const salesByYear = {
  2022: [20,30,28,40,50,45,58,70,66,80,95,88],
  2023: [25,35,33,48,60,52,68,85,78,96,110,102],
  2024: [30,40,35,55,65,60,72,88,82,96,110,105],
};

export default function Yearly() {
  const data = useMemo(() => {
    const years = [2022, 2023, 2024];
    return years.map((y) => {
      const rev = revenueByYear[y].reduce((s, v) => s + v, 0);
      const sales = salesByYear[y].reduce((s, v) => s + v, 0);
      return { year: String(y), Revenue: rev, Sales: sales };
    });
  }, []);

  return (
    <section className="yearly-wrapper">
      <header className="analytics-header">
        <h2 className="analytics-title">Yearly Overview (Revenue vs Sales)</h2>
      </header>

      <div className="chart-area">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#e6e7ea" vertical={false} />
            <XAxis dataKey="year" tick={{ fill: "#334155" }} />
            <YAxis tick={{ fill: "#334155" }} />
            <Tooltip formatter={(v) => v} />
            <Legend />
            <Bar dataKey="Revenue" fill="#0f172a" barSize={36} />
            <Bar dataKey="Sales" fill="#1e3a8a" barSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}