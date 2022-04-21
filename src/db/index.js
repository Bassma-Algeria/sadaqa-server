const { Pool } = require("pg");

const pool = new Pool({
  // ssl: { rejectUnauthorized: false },
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
