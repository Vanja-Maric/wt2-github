import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const AirbnbRoomTypeComparison = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDataFromElasticsearch = async (from = 0) => {
    try {
      const response = await fetch('http://localhost:9200/air_bnb_new_york_city/_search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: from,
          size: 1000,
          _source: ['room_type', 'price'],
          query: {
            match_all: {},
          },
        }),
      });

      const data = await response.json();

      if (data.hits && data.hits.hits) {
        const roomTypePrices = {};
        data.hits.hits.forEach(item => {
          const roomType = item._source.room_type;
          const price = item._source.price;
          if (!roomTypePrices[roomType]) {
            roomTypePrices[roomType] = { total: 0, count: 0 };
          }
          roomTypePrices[roomType].total += price;
          roomTypePrices[roomType].count += 1;
        });

        const labels = Object.keys(roomTypePrices);
        const values = labels.map(roomType => roomTypePrices[roomType].total / roomTypePrices[roomType].count);

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
      } else {
        console.error('No hits found in the response.');
      }

      if (data.hits && data.hits.hits.length > 0) {
        fetchDataFromElasticsearch(from + 1000);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDataFromElasticsearch();
  }, []);

  return (
    <div>
      <h2>Average Price by Room Type</h2>
      <p>
        This bar chart compares the average prices for different room types in Airbnb listings in New York City.
      </p>
      {loading ? <p>Loading chart...</p> : <Bar data={chartData} />}
    </div>
  );
};

export default AirbnbRoomTypeComparison;
