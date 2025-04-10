import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const AirbnbPriceByNeighborhood = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDataFromApi = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/airbnb/average-price-by-neighborhood');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const labels = Object.keys(data);
      const values = Object.values(data);

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Average Price by Neighborhood',
            data: values,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          },
        ],
      };

      setChartData(chartData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  return (
    <div>
      <h2>Average Price by Neighborhood</h2>
      <p>
        This chart displays the average price for Airbnb listings in different neighborhoods of New York City.
      </p>
      {loading ? <p>Loading chart...</p> : chartData ? <Bar data={chartData} /> : <p>No data available.</p>}
    </div>
  );
};

export default AirbnbPriceByNeighborhood;
