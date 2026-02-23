const pool = require("../db");
const Cursor = require("pg-cursor");

module.exports = async (job, res) => {
  res.setHeader("Content-Type", "application/xml");

  const client = await pool.connect();
  const cursor = client.query(new Cursor("SELECT * FROM records"));

  res.write("<records>");

  const read = () =>
    cursor.read(1000, (err, rows) => {
      if (!rows.length) {
        res.write("</records>");
        cursor.close(() => client.release());
        return res.end();
      }

      rows.forEach(r =>
        res.write(
          `<record>
            <id>${r.id}</id>
            <name>${r.name}</name>
            <value>${r.value}</value>
            <metadata>${JSON.stringify(r.metadata)}</metadata>
          </record>`
        )
      );

      read();
    });

  read();
};