const { Pool } = require("pg");

const pool = new Pool({
  ssl: { rejectUnauthorized: false },
  connectionString: process.env.DATABASE_URL,
});
// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = {
  // use it if you run just one query
  query: (queryString, params) => pool.query(queryString, params),
  endQuery: () => pool.end(),

  // use it in case you need to run a transaction
  getClient: () => pool.connect(),
};
