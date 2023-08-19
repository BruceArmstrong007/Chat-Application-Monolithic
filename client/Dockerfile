FROM node:alpine As development

WORKDIR /app

COPY . .

RUN npm install

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm run build --omit=dev

FROM nginx:alpine

EXPOSE 80

COPY --from=production /app/dist/client /usr/share/nginx/html
