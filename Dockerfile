# Build Stage 1
# This build created a staging docker image
#
FROM node:18-alpine as AppBuild

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
FROM node:18-alpine

RUN apk add --no-cache libcap

WORKDIR /home/app

COPY package.json ./


RUN npm install --omit=dev

COPY --from=AppBuild /home/app/build .

# Setup prisma client
RUN npm install -D prisma
RUN npx prisma generate


RUN npm install -g pm2

ENV PORT=80 NODE_ENV=production

# Set the privileges for our built app executable to run on privileged ports
RUN setcap 'cap_net_bind_service=+ep' /usr/local/bin/node

RUN chown -R node:node /home/app
USER node

EXPOSE 80

ENTRYPOINT ["sh", "-c", "npx prisma db push && pm2-runtime src/index.js"]
