FROM node:alpine As development

WORKDIR /usr/src/app

RUN npm install -g @angular/cli

COPY package*.json ./

RUN npm install

COPY . .

CMD ["ng", "serve", "--host", "0.0.0.0"]

FROM node:alpine as production

WORKDIR /usr/src/app

RUN npm install -g @ionic/cli

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /usr/src/app/dist/client /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
