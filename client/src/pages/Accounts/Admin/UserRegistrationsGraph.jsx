import React, { useState, useEffect } from 'react';
import http from '../../../http';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserRegistrationsGraph = () => {
    const [registrationData, setRegistrationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState('day'); // Default chart type

    useEffect(() => {
        const fetchRegistrationData = async () => {
            try {
                const response = await http.get('/Account/registrations/summary', { withCredentials: true });
                setRegistrationData(response.data);
            } catch (err) {
                setError(err);
                console.error("Error fetching registration data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrationData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!registrationData) {
        return <div>No data yet</div>;
    }

    const handleChartTypeChange = (event) => {
        setChartType(event.target.value);
    };

    let chartData = [];
    let xAxisKey = '';
    let chartLabel = '';

    switch (chartType) {
        case 'day':
            chartData = registrationData.daily.map(r => ({ date: r.date, count: r.count }));
            xAxisKey = 'date';
            chartLabel = 'Daily Registrations';
            break;
        case 'week':
            chartData = registrationData.weekly.map(w => ({ week: `${w.startDate} - ${w.endDate}`, count: w.count }));
            xAxisKey = 'week';
            chartLabel = 'Weekly Registrations';
            break;
        case 'month':
            chartData = registrationData.monthly.map(m => ({ month: `${m.startDate} - ${m.endDate}`, count: m.count }));
            xAxisKey = 'month';
            chartLabel = 'Monthly Registrations';
            break;
        default:
            chartData = registrationData.daily.map(r => ({ date: r.date, count: r.count })); // Default to daily
            xAxisKey = 'date';
            chartLabel = 'Daily Registrations';
            break;
    }

    return (
        <div>
            <div>
                <label htmlFor="chartType">Chart Type:</label>
                <select id="chartType" value={chartType} onChange={handleChartTypeChange}>
                    <option value="day">Daily</option>
                    <option value="week">Weekly</option>
                    <option value="month">Monthly</option>
                </select>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xAxisKey} /> {/* Dynamic xAxisKey */}
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UserRegistrationsGraph;