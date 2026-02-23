const express = require("express");
const { createJob, getJob } = require("../jobs/jobStore");

const csv = require("../exporters/csvExporter");
const json = require("../exporters/jsonExporter");
const xml = require("../exporters/xmlExporter");
const parquet = require("../exporters/parquetExporter");

const router = express.Router();

router.post("/", (req, res) => {
  const { format } = req.body;

  if (!format) {
    return res.status(400).json({ error: "format is required" });
  }

  if (!["csv", "json", "xml", "parquet"].includes(format)) {
    return res.status(400).json({ error: "invalid format" });
  }

  const job = createJob(req.body);
  res.status(201).json({ exportId: job.id, status: job.status });
});

router.get("/:id/download", (req, res) => {
  const job = getJob(req.params.id);
  if (!job) return res.sendStatus(404);

  if (job.format === "csv") return csv(job, res);
  if (job.format === "json") return json(job, res);
  if (job.format === "xml") return xml(job, res);
  if (job.format === "parquet") return parquet(job, res);

  res.status(400).json({ error: "unsupported format" });
});

module.exports = router;