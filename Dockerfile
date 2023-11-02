FROM node:16.17.0

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 6379

CMD [ "npm", "run", "start" ]
