import React, { useState, useMemo, useEffect } from "react";
import { Tooltip, ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, 
          Area, LineChart, Line, Legend } from "recharts";
import "./Monthly.css";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function Monthly() {
  const [year, setYear] = useState(2026);
  const years = [2025, 2026];
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);

  useEffect(() => {
    const fetchMonthlyStats = async () => {
      try {
        const response = await fetch(`http://localhost/popcart-api/get_monthly_stats.php?year=${year}`);
        const data = await response.json();
        if (data.success) {
          setMonthlyRevenue(data.revenue);
          setMonthlySales(data.sales);
        }
      } catch (error) {
        console.error('Error fetching monthly stats:', error);
      }
    };
    fetchMonthlyStats();
  }, [year]);

  const revenueData = useMemo(
    () => MONTHS.map((m, i) => ({ month: m, value: monthlyRevenue[i] || 0 })),
    [monthlyRevenue]
  );

  const salesData = useMemo(
    () => MONTHS.map((m, i) => ({ month: m, value: monthlySales[i] || 0 })),
    [monthlySales]
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
          <ResponsiveContainer width="100%" height={330}>
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
              <Tooltip formatter={(val) => `₱${val.toLocaleString()}`} />
              <Area type="monotone" dataKey="value" stroke="#0A0A0A" fill={`url(#revGrad-${year})`} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="total-display" style={{ marginTop: '20px' }}>
          <strong>Total Revenue {year}: ₱{monthlyRevenue.reduce((a, b) => a + b, 0).toLocaleString()}</strong>
        </div>
      </section>

      <section className="analytics-card">
        <header className="analytics-header">
          <h2 className="analytics-title">Sales — {year}</h2>
          <div className="small-legend"><span className="legend-swatch sales-swatch" /> Sales</div>
        </header>

        <div className="chart-area">
          <ResponsiveContainer width="100%" height={330}>
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

        <div className="total-display">
          <strong>Total Sales {year}: {monthlySales.reduce((a, b) => a + b, 0).toLocaleString()}</strong>
        </div>
      </section>
    </div>
  );
}