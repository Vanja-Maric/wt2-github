import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const AirbnbPriceDistribution = ({ neighborhood, roomType }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allPrices, setAllPrices] = useState([]);
  console.log(neighborhood, roomType);

  const fetchDataFromElasticsearch = async (from = 0) => {
    try {
      const query = {
        from: from,
        size: 1000,
        _source: ['price', 'neighbourhood_group', 'room_type'],
        query: {
          bool: {
            must: [
              { match: { neighbourhood_group: neighborhood } },
              { match: { room_type: roomType } },
            ],
          },
        },
      };


      const response = await fetch('http://localhost:9200/air_bnb_new_york_city/_search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.hits && data.hits.hits.length > 0) {
        const prices = data.hits.hits.map(hit => hit._source.price);
        setAllPrices(prevPrices => [...prevPrices, ...prices]);

        if (data.hits.hits.length === 1000) {
          fetchDataFromElasticsearch(from + 1000);
        } else {
          const priceData = processDataForChart([...allPrices, ...prices]);
          setChartData(priceData);
          setLoading(false);
        }
      } else {
        console.error('No hits found in the response.');
        setChartData(null);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const processDataForChart = (prices) => {
    const buckets = groupPricesIntoBuckets(prices);

    const labels = Object.keys(buckets);
    const values = Object.values(buckets);

    return {
      labels,
      datasets: [{
        data: values,
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
    setAllPrices([]);
    fetchDataFromElasticsearch();
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