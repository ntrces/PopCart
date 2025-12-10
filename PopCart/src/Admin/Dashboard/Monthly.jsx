import React, { useState, useMemo } from "react";
import { Tooltip, ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, 
          Area, LineChart, Line, Legend } from "recharts";
import "./Monthly.css";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const revenueByYear = {
  2022: [30, 45, 40, 55, 70, 60, 75, 95, 85, 100, 120, 110],
  2023: [38, 52, 48, 70, 85, 72, 90, 105, 98, 118, 135, 128],
  2024: [45, 60, 50, 75, 90, 80, 95, 110, 98, 120, 140, 130],
};

const salesByYear = {
  2022: [20, 30, 28, 40, 50, 45, 58, 70, 66, 80, 95, 88],
  2023: [25, 35, 33, 48, 60, 52, 68, 85, 78, 96, 110, 102],
  2024: [30, 40, 35, 55, 65, 60, 72, 88, 82, 96, 110, 105],
};

export default function Monthly() {
  const [year, setYear] = useState(2024);
  const years = [2024, 2023, 2022];

  const revenueData = useMemo(
    () => MONTHS.map((m, i) => ({ month: m, value: revenueByYear[year][i] })),
    [year]
  );

  const salesData = useMemo(
    () => MONTHS.map((m, i) => ({ month: m, value: salesByYear[year][i] })),
    [year]
  );

  return (
    <div className="monthly-wrapper">
      <div className="year-selector">
        {years.map((y) => (
          <button
            key={y}
            type="button"
            className={`year-btn ${year === y ? "active" : ""}`}
            onClick={() => setYear(y)}
          >
            {y}
          </button>
        ))}
      </div>

      <section className="analytics-card">
        <header className="analytics-header">
          <h2 className="analytics-title">Revenue — {year}</h2>
          <div className="small-legend"><span className="legend-swatch rev-swatch" /> Revenue</div>
        </header>

        <div className="chart-area">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`revGrad-${year}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e6e7ea" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#334155" }} />
              <YAxis tick={{ fill: "#334155" }} />
              <Tooltip formatter={(val) => `${val}`} />
              <Area type="monotone" dataKey="value" stroke="#0f172a" fill={`url(#revGrad-${year})`} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="analytics-card">
        <header className="analytics-header">
          <h2 className="analytics-title">Sales — {year}</h2>
          <div className="small-legend"><span className="legend-swatch sales-swatch" /> Sales</div>
        </header>

        <div className="chart-area">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={salesData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#e6e7ea" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#717182" }} />
              <YAxis tick={{ fill: "#717182" }} />
              <Tooltip formatter={(val) => `${val}`} />
              <Line type="monotone" dataKey="value" stroke="#717182" strokeWidth={2} dot={{ r: 2 }} />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}