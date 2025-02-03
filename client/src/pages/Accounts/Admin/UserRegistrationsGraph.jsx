import React, { useState, useEffect } from "react";
import http from "../../../http";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import dayjs from "dayjs";

const UserRegistrationsGraph = () => {
  const [registrationData, setRegistrationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState("day"); // Default chart type

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        const response = await http.get("/Account/registrations/summary", {
          withCredentials: true,
        });
        setRegistrationData(response.data);
      } catch (err) {
        setError("Error fetching registration data");
        console.error("Error fetching registration data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationData();
  }, []);

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  const filterDataByDate = (data, chartType) => {
    const now = dayjs();

    switch (chartType) {
      case "day":
        return data.filter((item) => dayjs(item.date).isAfter(now.subtract(7, "days")));
      case "week":
        return data.filter((item) => dayjs(item.startDate).isAfter(now.subtract(4, "week")));
      case "month":
        return data.filter((item) => dayjs(item.startDate).isAfter(now.subtract(6, "month")));
      default:
        return data;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!registrationData) {
    return <div>No data available</div>;
  }

  let chartData = [];
  let xAxisKey = "";
  let chartLabel = "";

  switch (chartType) {
    case "day":
      chartData = filterDataByDate(registrationData.daily, "day").map((r) => ({
        date: r.date,
        count: r.count,
      }));
      xAxisKey = "date";
      chartLabel = "Daily Registrations (Last 7 Days)";
      break;
    case "week":
      chartData = filterDataByDate(registrationData.weekly, "week").map((w) => ({
        week: `${w.startDate} - ${w.endDate}`,
        count: w.count,
      }));
      xAxisKey = "week";
      chartLabel = "Weekly Registrations (Last 4 Weeks)";
      break;
    case "month":
      chartData = filterDataByDate(registrationData.monthly, "month").map((m) => ({
        month: `${m.startDate} - ${m.endDate}`,
        count: m.count,
      }));
      xAxisKey = "month";
      chartLabel = "Monthly Registrations (Last 6 Months)";
      break;
    default:
      chartData = filterDataByDate(registrationData.daily, "day").map((r) => ({
        date: r.date,
        count: r.count,
      }));
      xAxisKey = "date";
      chartLabel = "Daily Registrations";
      break;
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "80vw", // Adjusted to make it responsive
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        textAlign: "center",
      }}
    >
      <h3
        style={{
          fontSize: "20px", // Slightly larger font for header
          fontWeight: "bold",
          marginBottom: "16px",
          color: "#333",
        }}
      >
        {chartLabel}
      </h3>

      <div style={{ marginBottom: "16px" }}>
        <label htmlFor="chartType" style={{ fontWeight: "bold" }}>
          Chart Type:
        </label>
        <select
          id="chartType"
          value={chartType}
          onChange={handleChartTypeChange}
          style={{
            marginLeft: "8px",
            padding: "5px 10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12, color: "#888" }}
            interval={0} // Ensures all labels are visible
          />
          <YAxis tick={{ fontSize: 12, color: "#888" }} />
          <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #ddd" }} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={true} // Show the dots
            activeDot={{ r: 8 }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ marginTop: "16px" }} // Added margin for legend
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserRegistrationsGraph;
