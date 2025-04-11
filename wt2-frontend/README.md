# Interactive Airbnb Price Visualization NYC

## Technologies

## Technologies Used

![.NET](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Chart.js](https://img.shields.io/badge/Chart.js-F5788D?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-FF4D4F?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)


---

## Project Description

This project is part of the *Assignment WT2 - Web for Data Science*. It focuses on building an interactive and publicly accessible data visualization web application using a real-world dataset.

The application visualizes Airbnb prices in New York City from 2019 using a dataset obtained from [Kaggle](https://www.kaggle.com/datasets/dgomonov/new-york-city-airbnb-open-data). The goal is to help users explore patterns and insights about accommodation prices across different boroughs and neighborhoods.

Through an intuitive user interface, users can interact with filters to view how Airbnb prices vary by room type, location, and availability. This project helps answer key questions such as:
- Which boroughs have the highest average prices?
- What room types are most common and how do their prices compare?
- Are there any noticeable trends in availability or listing frequency?

---

## Core Technologies

- **.NET Core Web API:** Used for backend development to handle requests, process data, and serve it to the frontend efficiently.  
- **PostgreSQL:** A robust relational database used to store and query structured Airbnb data.  
- **React.js:** A powerful frontend library used to build a responsive and interactive user interface.  
- **React-chartjs-2:** Librarie used for rendering clean and customizable data visualizations in the frontend.  
- **Docker:** Used for containerizing the application and running it locally or on a server with ease.

---

## How to Use

1. Clone the repository to your local machine.
2. Ensure you have Docker installed.
3. Run the application using Docker Compose:
   ```bash
   docker-compose up -d