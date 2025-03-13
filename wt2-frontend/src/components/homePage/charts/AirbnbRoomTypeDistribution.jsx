import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const AirbnbRoomTypeDistribution = () => {
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
          _source: ['room_type'],
          query: {
            match_all: {},
          },
        }),
      });

      const data = await response.json();

      if (data.hits && data.hits.hits) {
        const roomTypeCounts = {};

        // Count the occurrences of each room type
        data.hits.hits.forEach(item => {
          const roomType = item._source.room_type;
          if (!roomTypeCounts[roomType]) {
            roomTypeCounts[roomType] = 0;
          }
          roomTypeCounts[roomType] += 1;
        });

        const labels = Object.keys(roomTypeCounts);
        const values = Object.values(roomTypeCounts);

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
      <h2>Airbnb Room Type Distribution</h2>
      <p>
        This doughnut chart visualizes the distribution of Airbnb room types in New York City.
        Each slice represents a different room type (e.g., Entire home/apt, Private room, Shared room), and the size of the slice corresponds to the number of listings of that type.
      </p>
      {loading ? <p>Loading chart...</p> : <Doughnut data={chartData} />}
    </div>
  );
};

export default AirbnbRoomTypeDistribution;
