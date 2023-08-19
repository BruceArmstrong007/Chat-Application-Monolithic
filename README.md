# Chat-Application
Cross Platform Chat Application

Chat Application in Dev

# Prerequisite
  Docker/Docker-Desktop
  node & npm 
  

# Procedure to run this repo locally

1.) pull this repo  <br /> 
2.) cd to client and npm i  <br />
3.) cd to server and npm i  <br /> 
4.) cd back to root and docker-compose up server redis redis-insight mongodb --build -V <br /> 
5.) cd to client again and npm run start:local  <br /> 
6.) check http://localhost:4200/  <br /> 

# Steps 4 & 5 can be skipped if you do this  <br /> 
from root cmd - "docker-compose up --build -V"  this will also containerize the Angular-Ionic frontend App
And also takes some time to containerize and run

# Note

Make sure you use toggle device toolbar in your browser and set a android or ios device for better UI (Ionic)

# Try it out
