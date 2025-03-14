# Project Title

Replace this with the name of your project. It should be a brief and catchy title that accurately represents your application.

## Project Description

Write a brief description of your application here. The description should provide an overview of the application features, its purpose, and how it achieves the objective of the assignment. Discuss the dataset used and why it was chosen.

Describe the insights you are providing through your interactive visualization. Highlight the questions this project is intended to answer or the insights you aim to provide.

## Core Technologies

Include a list of the main technologies used in your project. Explain why you decided to use these technologies and what benefits they have provided in accomplishing your goals. This can include the backend framework, data analysis and processing tools, data visualization library, frontend technology, and deployment platform.

## How to Use

This section should contain instructions for how to use your application. Explain the controls used in your visualization and how to interact with it to uncover different insights. Providing screenshots and/or gifs can greatly help users understand how to use your application.

## Link to the Deployed Application

Include a link to the deployed application. The application should be hosted on a platform that allows public access.

## Additional features

Explain how you have addressed the assignment requirements. If you've added any custom functionality, discuss them in this section and link to the specific issues you have closed.

## Acknowledgements

Include a list of resources you found helpful, attributions, or shoutouts here.

## Run app in docker: 
- docker-compose up -d  
## Fix cors at Kibana (IF you are using kibana):
- docker exec -u 0 -it kibana bash
- apt-get update
- apt-get install nano
- cd usr/share/kibana/config
- nano kibana.yml
- add this lines to the file:
server.cors.enabled: true
server.cors.allowOrigin: ["*"]
- docker-compose restart


### At server start docker compose up and down 2 times to sync elastic and dontnet

ne radi trenutno udjes na remote server  (sa 103 nesto zavrsava) i ne mogu iz forntenda da dodem do elastica  

expozala sam sad elastic ali nece ove kasnije da dohvati sto su /airbnb-... poslije elastic. Vidi moze li se u nginx staviti expozanje nesto kao /elastic*