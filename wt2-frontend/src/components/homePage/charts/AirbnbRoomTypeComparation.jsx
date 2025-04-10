import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const AirbnbRoomTypeComparison = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDataFromApi = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/airbnb/average-price-by-room-type');
  
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
            label: 'Average Price by Room Type',
            data: values,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
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
      <h2>Average Price by Room Type</h2>
      <p>
        This bar chart compares the average prices for different room types in Airbnb listings in New York City.
      </p>
      {loading ? <p>Loading chart...</p> : chartData ? <Bar data={chartData} /> : <p>No data to display.</p>}
    </div>
  );
};

export default AirbnbRoomTypeComparison;
