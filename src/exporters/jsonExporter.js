const pool = require("../db");
const Cursor = require("pg-cursor");

module.exports = async (job, res) => {
  res.setHeader("Content-Type", "application/json");

  const client = await pool.connect();
  const cursor = client.query(new Cursor("SELECT * FROM records"));

  res.write("[");
  let first = true;

  const read = () =>
    cursor.read(1000, (err, rows) => {
      if (!rows.length) {
        res.write("]");
        cursor.close(() => client.release());
        return res.end();
      }

      rows.forEach(r => {
        if (!first) res.write(",");
        first = false;
        res.write(JSON.stringify(r));
      });

      read();
    });

  read();
};