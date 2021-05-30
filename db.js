const Pool = require("pg").Pool;

const pool = new Pool({
  user: "thotoawqxwfhpj",
  password: "07e55f074c0d4c53eca778bcc6a58cdfa34182950944ca675bdbc4afcef1e2f4",
  host: "ec2-54-225-228-142.compute-1.amazonaws.com",
  port: 5432,
  database: "df9tlk0mo2231u",
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
