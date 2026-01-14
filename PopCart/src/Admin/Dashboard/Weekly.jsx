import React, { useMemo, useState, useEffect } from "react";
import { Tooltip, ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Area, LineChart, Line } from "recharts";
import "./Weekly.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const sampleRevenueWeek = [12000, 9000, 10000, 13000, 11000, 12500, 14000];
const sampleSalesWeek = [8000, 7000, 7500, 9000, 8500, 9200, 9800];

export const Weekly = () => {
  const [weeklySales, setWeeklySales] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [days, setDays] = useState([]);

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      try {
        const response = await fetch('http://localhost/PopCart1/PopCart/PopCart/src/popcart-api/get_weekly_stats.php');
        const data = await response.json();
        if (data.success) {
          setWeeklySales(data.weekly_sales);
          setWeeklyRevenue(data.weekly_revenue);
          setDays(data.days);
        }
      } catch (error) {
        console.error('Error fetching weekly stats:', error);
      }
    };
    fetchWeeklyStats();
  }, []);

  return (
    <div className="weekly-wrapper">
      <RevenueAnalyticsSection weeklyRevenue={weeklyRevenue} days={days} />
      <SalesAnalyticsSection weeklySales={weeklySales} days={days} />
    </div>
  );
};


export const RevenueAnalyticsSection = ({ weeklyRevenue, days }) => {

  const data = useMemo(
    () => days.map((d, i) => ({ day: d, value: weeklyRevenue[i] || 0 })),
    [days, weeklyRevenue]
  );

  return (
    <section className="analytics-card" aria-labelledby="revenue-title">

      <div className="chart-area">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#e6e7ea" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: "#334155" }} />
            <YAxis tick={{ fill: "#334155" }} />
            <Tooltip formatter={(v) => `₱${v.toLocaleString()}`} />
            <Line type="monotone" dataKey="value" stroke="#0f172a" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="total-display">
        <strong>Total Revenue This Week: ₱{weeklyRevenue.reduce((a, b) => a + Number(b), 0).toLocaleString()}</strong>
      </div>


      <div className="analytics-legend">
        <span className="legend-swatch rev-swatch" />{" "}
        <span className="legend-label">Revenue</span>
      </div>
    </section>
  );
};

export const SalesAnalyticsSection = ({ weeklySales, days }) => {

  const data = useMemo(
    () => days.map((d, i) => ({ day: d, value: weeklySales[i] || 0 })),
    [days, weeklySales]
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

      <div className="total-display">
        <strong>Total Sales This Week: {weeklySales.reduce((a, b) => a + Number(b), 0).toLocaleString()}</strong>
      </div>

      <div className="analytics-legend">
        <span className="legend-swatch sales-swatch" />{" "}
        <span className="legend-label">Sales</span>
      </div>
    </section>
  );
};

export default Weekly;
