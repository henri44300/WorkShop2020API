# Check out https://hub.docker.com/_/node to select a new base image
FROM node:10-slim

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package*.json ./

RUN npm install

# Bundle app source code
COPY --chown=node . .

RUN npm run build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV PORT=${PORT}
ENV HOST=${HOST}
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_DATABASE=${DB_DATABASE}
ENV PUBLISH_ITERATION_NAME=${PUBLISH_ITERATION_NAME}
ENV PROJECT_ID=${PROJECT_ID}
ENV TRAINING_KEY=${TRAINING_KEY}
ENV PREDICTION_KEY=${PREDICTION_KEY}
ENV PREDICTION_RESOURCE_ID=${PREDICTION_RESOURCE_ID}
ENV END_POINT=${END_POINT}
ENV DB_CONNECTOR=${CONNECTOR}
ENV BASE_URL=${BASE_URL}
ENV S3_ACCOUNT_NAME=${S3_ACCOUNT_NAME}
ENV S3_ACCESS_KEY=${S3_ACCESS_KEY}
ENV S3_CONTAINER_NAME=${S3_CONTAINER_NAME}

EXPOSE ${PORT}
CMD [ "node", "." ]
