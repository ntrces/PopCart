import React, { useMemo } from "react";
import { Tooltip, ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Area, LineChart, Line } from "recharts";
import "./Weekly.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const sampleRevenueWeek = [12000, 9000, 10000, 13000, 11000, 12500, 14000];
const sampleSalesWeek = [8000, 7000, 7500, 9000, 8500, 9200, 9800];

export const Weekly = () => {
  return (
    <div className="weekly-wrapper">
      <RevenueAnalyticsSection />
      <SalesAnalyticsSection />
    </div>
  );
};


export const RevenueAnalyticsSection = () => {

  const data = useMemo(
    () => DAYS.map((d, i) => ({ day: d, value: sampleRevenueWeek[i] })),
    []
  );

  return (
    <section className="analytics-card" aria-labelledby="revenue-title">

      <div className="chart-area">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A0A0A" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#0A0A0A" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e6e7ea" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: "#334155" }} />
            <YAxis tick={{ fill: "#334155" }} />
            <Tooltip formatter={(v) => v.toLocaleString()} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#0f172a"
              fill="url(#revGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="analytics-legend">
        <span className="legend-swatch rev-swatch" />{" "}
        <span className="legend-label">Revenue</span>
      </div>
    </section>
  );
};

export const SalesAnalyticsSection = () => {

  const data = useMemo(
    () => DAYS.map((d, i) => ({ day: d, value: sampleSalesWeek[i] })),
    []
  );

  return (
    <section className="analytics-card" aria-labelledby="sales-title">

      <div className="chart-area">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#e6e7ea" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: "#334155" }} />
            <YAxis tick={{ fill: "#334155" }} />
            <Tooltip formatter={(v) => v.toLocaleString()} />
            <Line type="monotone" dataKey="value" stroke="#717182" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="analytics-legend">
        <span className="legend-swatch sales-swatch" />{" "}
        <span className="legend-label">Sales</span>
      </div>
    </section>
  );
};

export default Weekly;