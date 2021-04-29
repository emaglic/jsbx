FROM node:12.18.2

WORKDIR /app

COPY ["package.json", "./"]

RUN npm install
RUN npm install node-sass
RUN npm install http-server

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]