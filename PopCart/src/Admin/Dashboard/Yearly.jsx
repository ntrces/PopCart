import React, { useMemo, useState, useEffect } from "react";
import { apiUrl } from "../../utils/api.js";
import { Tooltip, ResponsiveContainer,CartesianGrid, XAxis, YAxis, BarChart, Legend, Bar} from "recharts";
import "./Yearly.css";

export default function Yearly() {
  const [yearlyData, setYearlyData] = useState([]);

  useEffect(() => {
    const fetchYearlyStats = async () => {
      try {
        const response = await fetch(apiUrl('get_yearly_stats.php'));
        const data = await response.json();
        if (data.success) {
          setYearlyData(data.data);
        }
      } catch (error) {
        console.error('Error fetching yearly stats:', error);
      }
    };
    fetchYearlyStats();
  }, []);

  const data = useMemo(() => {
    return yearlyData.map((item) => ({
      year: String(item.year),
      Revenue: item.Revenue,
      Sales: item.Sales
    }));
  }, [yearlyData]);

  return (
    <section className="yearly-wrapper">
      <header className="analytics-header">
        <h2 className="analytics-title">Yearly Overview</h2>
      </header>
      <div className="chart-area">
        <div className="chart-card">
          <h3 className="chart-card-title">Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#e6e7ea" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: "#334155" }} />
              <YAxis tick={{ fill: "#334155" }} />
              <Tooltip formatter={(v) => `₱${v.toLocaleString()}`} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="square" wrapperStyle={{ color: '#0f172a' }} />
              <Bar dataKey="Revenue" fill="#0a0a0a" barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-card-title">Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#e6e7ea" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: "#334155" }} />
              <YAxis tick={{ fill: "#334155" }} />
              <Tooltip formatter={(v) => v} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="square" wrapperStyle={{ color: '#0f172a' }} />
              <Bar dataKey="Sales" fill="#717182" barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
