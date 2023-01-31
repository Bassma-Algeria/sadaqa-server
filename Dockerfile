# Build Stage 1
# This build created a staging docker image
#
FROM node:16-alpine as AppBuild

WORKDIR /home/app

COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./
COPY src ./src

RUN npm install

RUN npm i -g @nestjs/cli

RUN npm run build

COPY src/components/_shared_/persistence/prisma/schema.prisma build/src/components/_shared_/persistence/prisma/schema.prisma

# Build Stage 2
# This build takes the production build from staging build
#
FROM node:16-alpine

RUN apk add --no-cache libcap

WORKDIR /home/app

COPY package.json ./


RUN npm install --omit=dev

# Setup prisma client
RUN npm install -D prisma
RUN npx prisma generate


RUN npm install -g pm2


COPY --from=AppBuild /home/app/build .

ENV PORT=80 NODE_ENV=production

# Set the privileges for our built app executable to run on privileged ports
RUN setcap 'cap_net_bind_service=+ep' /usr/local/bin/node

RUN chown -R node:node /home/app
USER node

EXPOSE 80

RUN touch start.sh
RUN echo " \
    #!/bin/sh \n \
    npx prisma db push \n \
    npx prisma db seed \n \
    pm2-runtime src/index.js \n \
    " > start.sh

ENTRYPOINT ["/bin/sh", "start.sh"]
