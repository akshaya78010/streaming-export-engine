const pool = require("../db");
const Cursor = require("pg-cursor");
const { tableFromJSON, RecordBatchWriter } = require("apache-arrow");

module.exports = async (job, res) => {
  res.setHeader("Content-Type", "application/vnd.apache.parquet");
  res.setHeader("Content-Disposition", "attachment; filename=export.parquet");

  const client = await pool.connect();
  const cursor = client.query(new Cursor("SELECT * FROM records"));

  const writer = RecordBatchWriter.writeAll([], { type: "file" });
  writer.pipe(res);

  const read = () =>
    cursor.read(5000, async (err, rows) => {
      if (!rows.length) {
        writer.close();
        cursor.close(() => client.release());
        return;
      }
      writer.write(tableFromJSON(rows));
      read();
    });

  read();
};