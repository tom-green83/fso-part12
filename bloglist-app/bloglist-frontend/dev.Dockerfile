FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

USER node

# npm start is the command to start the application in development mode
CMD ["npm", "start"]