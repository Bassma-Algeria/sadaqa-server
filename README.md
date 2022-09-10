## Sadaqa REST API

This is the REST API server of Sadaqa platform build in top nestjs.
Following a modular monolithic architecture where each module is either following a simple CRUD architecture or a clean
architecture depending on his complexity

## Available Scripts

- #### Running all the tests

```sh
npm test
```

- #### Checking test coverage

```sh
npm run test:coverage
```

- #### start the dev server in watch mode

```sh
npm run start:dev
```

- #### start the normal dev server

```sh
npm run start
```

- #### start the prod server

```sh
npm run build && npm run start:prod
```

- #### run the dev server in Docker

first create the containers and run them

```sh
docker-compose up
```

then access the shell of the container of the server app

```sh
docker exec -it <SERVER_APP_CONTAINER_ID> sh
```

and finally set up the database

```sh
npx prisma migrate dev && npx prisma db seed
```
