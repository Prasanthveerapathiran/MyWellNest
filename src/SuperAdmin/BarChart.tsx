import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';
import axios from 'axios';
import { useToken } from '../api/Token'; // Assuming you're using a Token context to handle tokens

Chart.register(BarElement, CategoryScale, LinearScale);

interface MedicalRecord {
  id: number;
  amount: number;
  visitDate: string;
}

const BarChart: React.FC = () => {
  const { accessToken } = useToken(); // Fetch the access token from your custom hook or context
  const [monthlyAmounts, setMonthlyAmounts] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/medical-records', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Process the data to calculate monthly totals
        const records: MedicalRecord[] = response.data;
        const monthlyData = new Array(12).fill(0); // Array to store totals for each month

        records.forEach((record) => {
          const visitDate = new Date(record.visitDate);
          const month = visitDate.getMonth(); // 0 for Jan, 1 for Feb, ..., 11 for Dec
          monthlyData[month] += record.amount; // Sum up the amounts for each month
        });

        setMonthlyAmounts(monthlyData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching medical records:', error);
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchMedicalRecords();
    }
  }, [accessToken]);

  // Define chart data
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Sales (Amount)',
        data: monthlyAmounts,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: true } },
    },
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  return <Bar data={data} options={options} />;
};

export default BarChart;
