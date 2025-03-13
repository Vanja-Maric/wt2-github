import React, { useState, useEffect } from 'react';

const KibanaDashboard = () => {
  const [dashboardUrl, setDashboardUrl] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Initializing Kibana setup...");

  // Function to create the Index Pattern in Kibana
  const createIndexPatternInKibana = async () => {
    const requestBody = {
      index_pattern: {
        "title": "air_bnb_new_york_city",
        "timeFieldName": "@timestamp"
      }
    };
    console.log("Sending request to create index pattern with body:", requestBody);
    try {
      // Send POST request to create the index pattern (data view)
      const response = await fetch('http://localhost:5601/api/index_patterns/index_pattern', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'kbn-xsrf': 'true',
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      if (!response.ok && response.status !== 400 && response.message !== "Duplicate index pattern: air_bnb_new_york_city") {
        throw new Error('Failed to create the index pattern');
      }

      const responseData = await response.json();
      console.log('Index pattern created successfully:', responseData);
      setStatusMessage("Index Pattern created successfully.");

    } catch (error) {
      console.error('Error:', error);
      setStatusMessage("Error creating Index Pattern.");
    }
  };



  // Function to create pie chart visualization (Availability by Neighborhood)
  const createPieChartInKibana = async () => {
    const requestBody = {
      "attributes": {
        "title": "Airbnb Price Distribution",
        "visState": JSON.stringify({
          "title": "Airbnb Price Distribution",
          "type": "pie",
          "aggs": [
            {
              "id": "1",
              "enabled": true,
              "type": "avg",
              "field": "price",
              "schema": "metric"
            },
            {
              "id": "2",
              "enabled": true,
              "type": "terms",
              "field": "property_type.keyword",
              "size": 5,
              "order": "desc",
              "schema": "bucket"
            }
          ],
          "params": {
            "fontSize": "12"
          }
        }),
        "uiStateJSON": "{}",
        "version": 1
      }
    };
  
    try {
      const response = await fetch('http://localhost:5601/api/saved_objects/visualization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'kbn-xsrf': 'true',
        },
        body: JSON.stringify(requestBody),
      });
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      const result = await response.json();
      console.log('Index pattern created successfully:', responseData);
      if (!response.ok) {
        throw new Error('Failed to create the pie chart visualization');
      }

      console.log('Pie chart visualization created successfully:', result);

      // After creating the visualization, create a dashboard to include this visualization
      createDashboardWithVisualization(result.id);
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage("Error creating pie chart.");
    }
  };

  // Function to create a dashboard with the created visualization (bar chart or pie chart)
  const createDashboardWithVisualization = async (visualizationId) => {
    const requestBody = {
      attributes: {
        title: "Airbnb Data Dashboard",
        panelsJSON: JSON.stringify([
          {
            panelIndex: "1",
            gridData: {
              w: 24,
              h: 15,
              x: 0,
              y: 0,
              i: "1",
            },
            embeddableConfig: {},
            version: "7.14.0", // Replace with your Kibana version
            type: "visualization",
            id: visualizationId,
          },
        ]),
        optionsJSON: JSON.stringify({ useMargins: true }),
      },
    };

    try {
      const response = await fetch('http://localhost:5601/api/saved_objects/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'kbn-xsrf': 'true',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to create the dashboard');
      }

      const result = await response.json();
      const dashboardId = result.id;

      console.log('Dashboard created successfully:', result);

      // Set the URL for displaying the dashboard
      setDashboardUrl(`http://localhost:5601/app/dashboards#/view/${dashboardId}`);
      setStatusMessage("Dashboard created successfully.");

    } catch (error) {
      console.error('Error:', error);
      setStatusMessage("Error creating dashboard.");
    }
  };

  // Trigger both visualizations when the component is mounted
  useEffect(() => {
    createIndexPatternInKibana();
    createPieChartInKibana();
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      <h2>Status: {statusMessage}</h2>
      {dashboardUrl ? (
        <iframe
          src={dashboardUrl}
          width="100%"
          height="100%"
          title="Kibana Dashboard"
        />
      ) : (
        <p>Creating visualizations and dashboard in Kibana...</p>
      )}
    </div>
  );
};

export default KibanaDashboard;
