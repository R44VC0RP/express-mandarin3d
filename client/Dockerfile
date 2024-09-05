FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV REACT_APP_BACKEND_URL=https://api.ci.mandarin3d.com

CMD ["npm", "run", "start"]