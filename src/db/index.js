const { Pool } = require("pg");

const options = {};

if (process.env.NODE_ENV === "production") {
  options.ssl = { rejectUnauthorized: false };
}

const pool = new Pool({
  ...options,
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = {
  query: (queryString, params) => pool.query(queryString, params),
  endQuery: () => pool.end(),

  getClient: () => pool.connect(),
};
