FROM node:16 AS base-stage

WORKDIR /usr/src/app
COPY . .
RUN npm ci

FROM base-stage as test-stage
ENV CI=true
RUN npm run test

FROM base-stage AS build-stage
ENV REACT_APP_BACKEND_URL=api/
RUN npm install serve
RUN npm run build
CMD ["npx", "serve", "build"]
