import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const AirbnbPriceByNeighborhood = () => {
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
          _source: ['neighbourhood', 'price'],
          query: {
            match_all: {},
          },
        }),
      });

      const data = await response.json();

      if (data.hits && data.hits.hits) {
        const neighborhoodPrices = {};
        data.hits.hits.forEach(item => {
          const neighborhood = item._source.neighbourhood;
          const price = item._source.price;
          if (!neighborhoodPrices[neighborhood]) {
            neighborhoodPrices[neighborhood] = { total: 0, count: 0 };
          }
          neighborhoodPrices[neighborhood].total += price;
          neighborhoodPrices[neighborhood].count += 1;
        });

        const labels = Object.keys(neighborhoodPrices);
        const values = labels.map(neighborhood => neighborhoodPrices[neighborhood].total / neighborhoodPrices[neighborhood].count);

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
      <h2>Average Price by Neighborhood</h2>
      <p>
        This chart displays the average price for Airbnb listings in different neighborhoods of New York City.
      </p>
      {loading ? <p>Loading chart...</p> : <Bar data={chartData} />}
    </div>
  );
};

export default AirbnbPriceByNeighborhood;
