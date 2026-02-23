const pool = require("../db");
const Cursor = require("pg-cursor");
const { stringify } = require("csv-stringify");

module.exports = async (job, res) => {
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=export.csv");

  const client = await pool.connect();
  const cursor = client.query(new Cursor("SELECT * FROM records"));

  const csv = stringify({ header: true });
  csv.pipe(res);

  const read = () =>
    cursor.read(1000, (err, rows) => {
      if (!rows.length) {
        cursor.close(() => client.release());
        return csv.end();
      }
      rows.forEach(r =>
        csv.write({ ...r, metadata: JSON.stringify(r.metadata) })
      );
      read();
    });

  read();
};