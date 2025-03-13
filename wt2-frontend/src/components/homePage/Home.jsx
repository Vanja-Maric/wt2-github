import React, { useState, useEffect } from 'react';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AirbnbPriceDistribution from './charts/AirbnbPriceDistibution.jsx';
import AirbnbPriceByNeighborhood from './charts/AirbnbPriceByNeighborhood.jsx';
import AirbnbRoomTypeComparison from './charts/AirbnbRoomTypeComparation.jsx';
import AirbnbPriceVsReviews from './charts/AirbnbPriceVsReviews.jsx';
import AirbnbRoomTypeDistribution from './charts/AirbnbRoomTypeDistribution.jsx';

export function Home() {
  const [neighborhood, setNeighborhood] = useState('Manhattan');
  const [roomType, setRoomType] = useState('Entire home/apt');
  const [neighborhoods, setNeighborhoods] = useState([]);

  useEffect(() => {
    // Function to fetch neighborhoods from Elasticsearch
  const fetchNeighborhoods = async (from = 0) => {
    try {
      const query = {
        from: from,
        size: 1000,
        _source: ['neighbourhood_group'],
        query: {
          match_all: {},
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
        const neighborhoods = data.hits.hits.map(hit => hit._source.neighbourhood_group);
        setNeighborhoods(prevneighborhoods => [...prevneighborhoods, ...neighborhoods]);
        // all neighborhoods unique
        setNeighborhoods(setNeighborhoods => [...new Set(setNeighborhoods)]);

        if (data.hits.hits.length === 1000) {
          fetchNeighborhoods(from + 1000);
        } else {
          const neighborhoodData = processDataForChart([...allneighborhoods, ...neighborhoods]);
          setNeighborhoods(neighborhoods); 
        }
      } else {
        console.error('No hits found in the response.');
        setNeighborhoods(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
    fetchNeighborhoods();
  }, []);

  const handleNeighborhoodChange = (event) => {
    setNeighborhood(event.target.value);
  };

  const handleRoomTypeChange = (event) => {
    setRoomType(event.target.value);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        
        {/* Left column for charts */}
        <div className="col-md-6">
          <AirbnbPriceDistribution neighborhood={neighborhood} roomType={roomType} />
          <div className="filters d-flex">
            <div className="me-3">
              <label>
                Neighborhood group:
                <select value={neighborhood} onChange={handleNeighborhoodChange}>
                  {neighborhoods.map((neighborhood, index) => (
                    <option key={index} value={neighborhood}>{neighborhood}</option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <label>
                Room Type:
                <select value={roomType} onChange={handleRoomTypeChange}>
                  <option value="Entire home/apt">Entire home/apt</option>
                  <option value="Private room">Private room</option>
                  <option value="Shared room">Shared room</option>
                  <option value="Hotel room">Hotel room</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        {/* Right column for text content */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h1>Welcome to New York Airbnb Prices</h1>
          <p>
            The goal of this page is to present you with statistics on Airbnb prices in
            New York so you can orient yourself before your next trip. The data is sourced
            from <a href="https://www.kaggle.com/datasets/dgomonov/new-york-city-airbnb-open-data" target="_blank" rel="noopener noreferrer">this Kaggle dataset</a>, which describes the listing activity and metrics in NYC for 2019.
          </p>
        </div>
      </div>

      <div className="row mt-5">
        {/* Price by Neighborhood Chart */}
        <div className="col-md-6">
          <AirbnbPriceByNeighborhood/>
        </div>

        {/* Room Type Comparison Chart */}
        <div className="col-md-6">
          <AirbnbRoomTypeComparison/>
        </div>
      </div>

      <div className="row mt-5">
        {/* Price vs Reviews Chart */}
        <div className="col-md-6">
          <AirbnbPriceVsReviews/>
        </div>

        {/* Room Type Distribution Chart */}
        <div className="col-md-6">
          <AirbnbRoomTypeDistribution/>
        </div>
      </div>
    </div>
  );
}