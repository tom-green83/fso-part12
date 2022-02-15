FROM node:16 AS base-stage

WORKDIR /usr/src/app

COPY . .

FROM base-stage as test-stage
RUN npm install
ENV CI=true
RUN npm run test

FROM base-stage AS build-stage
RUN npm install
ENV REACT_APP_BACKEND_URL=http://localhost:3000
CMD ["npm", "run", "build"]