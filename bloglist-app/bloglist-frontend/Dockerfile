FROM node:16 AS base-stage
WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN npm ci
# USER node

FROM base-stage AS test-stage
ENV CI=true
RUN npm run test

FROM base-stage AS build-stage
RUN npm install serve
RUN npm run build
CMD ["npx", "serve", "build"]