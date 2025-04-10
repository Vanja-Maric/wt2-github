import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const AirbnbPriceDistribution = ({ neighborhood, roomType }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDataFromApi = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/airbnb/price-distribution?neighborhood=${encodeURIComponent(neighborhood)}&roomType=${encodeURIComponent(roomType)}`
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const buckets = await response.json(); 
  
      const priceData = processDataForChart(buckets);
      setChartData(priceData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };  

  const processDataForChart = (buckets) => {
    return {
      labels: Object.keys(buckets), 
      datasets: [{
        data: Object.values(buckets),  
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }],
    };
  };

  const groupPricesIntoBuckets = (prices) => {
    const buckets = {};

    prices.forEach(price => {
      const bucketKey = Math.floor(price / 50) * 50;
      if (!buckets[bucketKey]) {
        buckets[bucketKey] = 0;
      }
      buckets[bucketKey] += 1;
    });

    return buckets;
  };

  useEffect(() => {
    fetchDataFromApi();
  }, [neighborhood, roomType]);

  return (
    <div>
      <p>
        This chart visualizes the distribution of prices for Airbnb listings in New York City.
        The data is grouped into price ranges (e.g., $0-$50, $50-$100, etc.), and the chart
        displays the number of listings that fall into each price range.
      </p>
      {loading ? (
        <p>Loading chart...</p>
      ) : (
        chartData ? <Pie data={chartData} /> : <p>No data available for the selected filters.</p>
      )}
    </div>
  );
};

export default AirbnbPriceDistribution;
