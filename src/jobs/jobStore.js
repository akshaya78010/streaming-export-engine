const { randomUUID } = require("crypto");

const jobs = new Map();

function createJob(config) {
  const id = randomUUID();
  jobs.set(id, { id, status: "pending", ...config });
  return jobs.get(id);
}

function getJob(id) {
  return jobs.get(id);
}

module.exports = { createJob, getJob };