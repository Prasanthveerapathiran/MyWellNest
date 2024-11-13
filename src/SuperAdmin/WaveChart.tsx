import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import axios from 'axios';
import { useToken } from '../api/Token';

Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

interface Patient {
  id: number;
  name: string;
  createdDate: string;
}

interface WaveChartProps {
  selectedBranch: string; // Selected branch passed from the parent
}

const WaveChart: React.FC<WaveChartProps> = ({ selectedBranch }) => {
  const { accessToken } = useToken();
  const [patientData, setPatientData] = useState<Patient[]>([]);
  const [chartData, setChartData] = useState<any>({});
  const [last7DaysCount, setLast7DaysCount] = useState(0);
  const [last30DaysCount, setLast30DaysCount] = useState(0);
  const [allTimeCount, setAllTimeCount] = useState(0);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!selectedBranch) return;

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/patients/branch/${selectedBranch}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPatientData(response.data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    if (accessToken && selectedBranch) {
      fetchPatientData();
    }
  }, [accessToken, selectedBranch]);

  useEffect(() => {
    if (patientData.length > 0) {
      const today = new Date();
      const last7Days = new Date(today);
      last7Days.setDate(today.getDate() - 7);
      const last30Days = new Date(today);
      last30Days.setDate(today.getDate() - 30);

      // Filter patients based on createdDate
      const last7DaysPatients = patientData.filter(patient =>
        new Date(patient.createdDate) >= last7Days
      );
      const last30DaysPatients = patientData.filter(patient =>
        new Date(patient.createdDate) >= last30Days
      );

      // Update the counts
      setLast7DaysCount(last7DaysPatients.length);
      setLast30DaysCount(last30DaysPatients.length);
      setAllTimeCount(patientData.length);

      // Group patients by date for charting
      const dates = patientData.map(patient => new Date(patient.createdDate).toLocaleDateString());
      const patientCountByDate = dates.reduce((count: { [key: string]: number }, date: string) => {
        count[date] = (count[date] || 0) + 1;
        return count;
      }, {});

      // Prepare data for the chart
      const chartLabels = Object.keys(patientCountByDate);
      const chartValues = Object.values(patientCountByDate);

      setChartData({
        labels: chartLabels,
        datasets: [
          {
            label: 'Patients Created Date-wise',
            data: chartValues,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          },
        ],
      });
    }
  }, [patientData]);

  const options = {
    responsive: true,
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: true } },
    },
  };

  return (
    <div>
      {chartData.labels ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>No data available for this branch.</p>
      )}

      {/* Display last 7 days, 30 days, and all-time patient counts */}
      <div style={{ marginTop: '20px' }}>
        <p><strong>Last 7 Days Count:</strong> {last7DaysCount}</p>
        <p><strong>Last 30 Days Count:</strong> {last30DaysCount}</p>
        <p><strong>All Time Count:</strong> {allTimeCount}</p>
      </div>
    </div>
  );
};

export default WaveChart;
