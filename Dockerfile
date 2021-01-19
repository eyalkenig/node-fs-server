FROM node:10.16.0-slim

COPY package.json ./
COPY package-lock.json ./

RUN npm set progress=false && npm config set depth 0
RUN npm install --no-optional --loglevel=warn

COPY . .

ENTRYPOINT ["/usr/local/bin/npm", "run", "server"]
