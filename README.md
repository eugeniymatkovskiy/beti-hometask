# User activity tracker app

<p>Powered by NestJS framework and Docker</p>
<img src="https://skills.thijs.gg/icons?i=docker,nest&theme=light" width="300"/>

## Run app with Docker
1. Build images by running the following command in root folder: **docker-compose build**
1. Run app in Docker by: **docker-compose up**
1. Open swagger: http://localhost:3000/api
1. Register new user by the following route: /auth/register
1. Login by created user in /auth route using POST request

## Running app on the host machinne
1. Run **npm install** in **./backend** folder
1. Run **npm start** in **./backend** folder
1. Don't forget to run **MySQL** and **Redis** on your host machine

When user has been authenticated 'start activity' key with current timestamp was added to the redis with expiration time of an hour and five minutes
After one hour but less than hour and five minutes when user tried to reach the server he will receive an error with 403 status code
If the user try reach the server after hour and five minutes everything will be fine, new key with current timestamp will be generated and stored to redis
