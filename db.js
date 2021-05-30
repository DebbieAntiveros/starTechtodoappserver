const Pool = require("pg").Pool;

const pool = new Pool({
  user: "ipjorzeaafxbkt",
  password: "bb7b47fe76adf3b0b8f249f1e2f42e1ef786bfc1caf1a7dc89511b2ad693efaf",
  host: "ec2-54-161-239-198.compute-1.amazonaws.com",
  port: 5432,
  database: "ddlsh1h3c7lt7f",
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
