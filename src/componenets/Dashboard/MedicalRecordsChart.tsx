import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { useToken } from '../../api/Token'; // Adjust the import path based on your folder structure

interface MedicalRecord {
  visitDate: string; // ISO 8601 date string
  amount: number;
}

const MedicalRecordsChart: React.FC = () => {
  const [chartOptions, setChartOptions] = useState<any>(null);
  const [chartSeries, setChartSeries] = useState<any[]>([]);
  const { accessToken } = useToken();

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/medical-records', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data: MedicalRecord[] = response.data;

        // Initialize data structure for months of the year
        const monthlyData: { [key: string]: number } = {};
        const months = Array.from({ length: 12 }, (_, i) => {
          const date = new Date(0, i); // Create a Date object for each month
          return date.toLocaleString('default', { month: 'short' });
        });

        months.forEach(month => {
          monthlyData[month] = 0; // Initialize each month with zero
        });

        // Aggregate data by month
        data.forEach(record => {
          const date = new Date(record.visitDate);
          const monthName = date.toLocaleString('default', { month: 'short' });

          if (monthlyData[monthName] !== undefined) {
            monthlyData[monthName] += record.amount;
          }
        });

        // Extract the sorted months and corresponding values
        const labels = months;
        const values = months.map(month => monthlyData[month]);

        setChartOptions({
          chart: {
            type: 'line',
            height: 350,
          },
          xaxis: {
            categories: labels,
          },
          yaxis: {
            labels: {
              formatter: (val: number) => `${val.toFixed(0)}k`,
            },
            tickAmount: 6, // Adjust tick amount to display 1k, 2k, 3k, etc.
          },
          stroke: {
            curve: 'smooth',
          },
          tooltip: {
            y: {
              formatter: (val: number) => `$ ${val}k`,
            },
          },
        });

        setChartSeries([
          {
            name: 'Total Amount',
            data: values.map(value => value / 1000), // Convert to thousands
          },
        ]);
      } catch (error) {
        console.error('Error fetching medical records:', error);
      }
    };

    fetchMedicalRecords();
  }, [accessToken]);

  return (
    <Box component={Paper} elevation={3} p={2} mt={2}>
      <Typography variant="h6" gutterBottom>
        Earnings Report
      </Typography>
      {chartOptions && chartSeries.length > 0 ? (
        <Chart options={chartOptions} series={chartSeries} type="line" height={350} />
      ) : (
        <Typography variant="body1">Loading chart data...</Typography>
      )}
    </Box>
  );
};

export default MedicalRecordsChart;
