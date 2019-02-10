FROM node:8-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Do this step here to take advantage of docker layer caching. Should make the image smaller and rebuilds faster
COPY . .
RUN npm run build

# Run on port 8081
EXPOSE 8081

CMD ["node", "dist/server.js"]