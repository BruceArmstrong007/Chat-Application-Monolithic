# Chat-Application
Cross Platform Chat Application

# Features
  Register, Login and Authentication with session for a week, <br />
  Dark & Light Mode, <br />
  Realtime searching users, sending invites, accepting invites, remove contacts etc.., <br />
  You will see your contact's online presence and vise versa, <br />
  Realtime Chat with your contacts, <br />/>
  Know number of unread messages and notifications, <br />
  See delivered and seen messages, contact will know that you are typing and vise versa, <br />
  Realtime contact updates (get notified when a user sent a invite), <br />
  Add/Update profile picture, name or even bio (in progress), <br />
  Can reset password in settings. <br />
  

# Prerequisite
  Docker/Docker-Desktop
  node & npm
  MongoDB Compass - Optional

# Procedure to run this repo locally
1.) pull this repo  <br /> 
2.) cd to client and npm i  <br />
3.) cd to server and npm i  <br /> 
4.) cd back to root and docker-compose up server redis redis-insight mongodb --build -V <br /> 
5.) cd to client again and npm run start:local  <br /> 
6.) check http://localhost:4200/  <br /> 
7.) to check redisdb http://localhost:8001/ (Host: redis, port: 6379, name: local, username: default, password: password)
8.) to check mongodb open mongodb compass and connect to this url mongodb://root:password123@localhost:27017/

# Steps 4 & 5 can be skipped if you do this 
  From root cmd - "docker-compose up --build -V"  this will also containerize the Angular-Ionic frontend app 
  and also takes some time to containerize and run

# Note
  Angularv16, IonicV7, NestJS(monolithic), redis pub/sub & redisdb, MongoDB, Docker, built with only signals ( No NGRX & RxJS so far ), Basic default UI and themes, Socket.io extensive implementation <br />
  Make sure you use toggle device toolbar in your browser and set a android or ios device for better UI (Ionic)
  Don't expect API & UI with error handling, loggers, testing and stuff (not there yet) , purely focusing on functionality

# What's special
  Learning the Techs mentioned in note, as well as building a chat application project with backend scalability in mind

# Possibilities
  with redis pub/sub, websockets are H-scalable <br />
  and redis is also H-scalable with redis clusters <br />
  mongodb also H-scalable with multiple instances <br />
  NestJS monolithic to microservices (if required) is also possible with message brokers or other methods <br />

  
  
  

  
