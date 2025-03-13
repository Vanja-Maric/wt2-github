import React, { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const AirbnbPriceVsReviews = () => {
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
          _source: ['price', 'number_of_reviews'],
          query: {
            match_all: {},
          },
        }),
      });

      const data = await response.json();

      if (data.hits && data.hits.hits) {
        const scatterData = {
          datasets: [
            {
              label: 'Price vs Number of Reviews',
              data: data.hits.hits.map(item => ({
                x: item._source.number_of_reviews,
                y: item._source.price,
              })),
              backgroundColor: 'rgba(255, 159, 64, 0.6)',
            },
          ],
        };
        setChartData(scatterData);
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
      <h2>Airbnb Price vs Number of Reviews</h2>
      <p>
        This scatter chart compares the price of Airbnb listings with the number of reviews they have received.
        Each point represents a listing, with the x-axis showing the number of reviews and the y-axis showing the price.
      </p>
      {loading ? <p>Loading chart...</p> : <Scatter data={chartData} />}
    </div>
  );
};

export default AirbnbPriceVsReviews;
