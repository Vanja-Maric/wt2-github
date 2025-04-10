import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const AirbnbRoomTypeDistribution = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDataFromApi = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/airbnb/room-types');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const labels = Object.keys(data);
      const values = Object.values(data);

      const doughnutData = {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          },
        ],
      };

      setChartData(doughnutData);
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
      <h2>Airbnb Room Type Distribution</h2>
      <p>
        This doughnut chart visualizes the distribution of Airbnb room types in New York City.
        Each slice represents a different room type (e.g., Entire home/apt, Private room, Shared room), and the size of the slice corresponds to the number of listings of that type.
      </p>
      {loading ? <p>Loading chart...</p> : chartData ? <Doughnut data={chartData} /> : <p>No data available.</p>}
    </div>
  );
};

export default AirbnbRoomTypeDistribution;
