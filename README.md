# High-Performance Streaming Data Export Engine

A production-grade, memory-efficient data export service capable of streaming **10 million+ rows** from PostgreSQL into multiple formats (**CSV, JSON, XML, Parquet**) using constant memory.  
The system is fully containerized and designed to demonstrate real-world backend data engineering patterns.

---

## 🚀 Features

- **Streams massive datasets** (10,000,000 rows) without loading them into memory
- Supports **multiple export formats**:
  - CSV (row-oriented)
  - JSON (streamed array)
  - XML (hierarchical streaming)
  - Parquet (columnar, analytics-optimized)
- **Dockerized** with one-command setup
- PostgreSQL database automatically **seeded on startup**
- Designed for **low memory usage (256MB limit)**
- Extensible export architecture (easy to add new formats)
- Realistic data schema with nested JSON (`JSONB`)

---

## 🏗 Architecture Overview

Client
|
| POST /exports
| GET /exports/:id/download
|
Node.js (Express)
|
|-- Export Job Store (in-memory)
|
|-- Streaming Exporters
|-- CSV Writer
|-- JSON Stream Writer
|-- XML Stream Writer
|-- Parquet Writer (Apache Arrow)
|
PostgreSQL
|
|-- records table (10,000,000 rows)

### Key Design Principle

> **At no point is the full dataset loaded into memory.**  
> Data is read in small batches using database cursors and written directly to the HTTP response stream.

---

## 🧰 Tech Stack

- **Backend:** Node.js (Express)
- **Database:** PostgreSQL 13
- **Streaming:** pg-cursor, Node.js streams
- **CSV:** csv-stringify
- **Parquet:** Apache Arrow
- **Containerization:** Docker & Docker Compose

---

## 📦 Project Structure

.
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── init-db.sh
├── package.json
├── README.md
└── src
├── index.js
├── db.js
├── routes
│ └── exports.js
├── jobs
│ └── jobStore.js
└── exporters
├── csvExporter.js
├── jsonExporter.js
├── xmlExporter.js
└── parquetExporter.js

---

## ⚙️ Setup & Installation

### Prerequisites

- Docker
- Docker Compose

### Environment Variables

Create a `.env` file in the project root:

````env
DATABASE_URL=postgresql://user:password@db:5432/exports_db
PORT=8080

(See .env.example)

▶️ Run the Project
docker compose up --build

⏳ First startup may take several minutes because PostgreSQL is seeded with 10 million rows.

🗄 Database Schema

Table: records

Column	Type
id	BIGSERIAL (PK)
created_at	TIMESTAMPTZ
name	VARCHAR(255)
value	DECIMAL(18,4)
metadata	JSONB

Example metadata:

{
  "index": 42,
  "nested": {
    "flag": true,
    "score": 0.83
  }
}
🔌 API Documentation
1️⃣ Create Export Job

Endpoint

POST /exports

Request Body

{
  "format": "csv | json | xml | parquet"
}

Response

{
  "exportId": "UUID",
  "status": "pending"
}
2️⃣ Download Export

Endpoint

GET /exports/{exportId}/download

Behavior

Streams data directly to the client

Uses chunked transfer encoding

Low, constant memory usage

Content Types

Format	Content-Type
CSV	text/csv
JSON	application/json
XML	application/xml
Parquet	application/vnd.apache.parquet
📤 Export Format Details
CSV

Header row included

metadata serialized as JSON string

Spreadsheet-friendly

JSON

Single valid JSON array

Nested objects preserved

XML

Root element: <records>

Each row as <record>

Nested JSON serialized inside <metadata>

Parquet

Columnar storage

Highly compressed

Ideal for analytics workloads

🧪 Testing Commands
Create Export Job
curl -X POST http://localhost:8080/exports \
  -H "Content-Type: application/json" \
  -d '{"format":"csv"}'
Download
curl http://localhost:8080/exports/EXPORT_ID/download -o export.csv
Verify Database Rows
docker exec -it streaming-export-engine-db-1 \
psql -U user -d exports_db -c "SELECT COUNT(*) FROM records;"

Expected:

10000000
🧠 Performance Characteristics
Format	File Size	Speed	Use Case
CSV	Medium	Fast	Business users
JSON	Large	Medium	APIs
XML	Largest	Slow	Legacy systems
Parquet	Smallest	Fastest	Analytics
🔐 Security Considerations

Database access via environment variables

No raw user input used in SQL queries

Export IDs are UUIDs (non-guessable)

Streaming avoids memory exhaustion attacks

🔧 Extensibility

New formats can be added by:

Creating a new exporter in src/exporters

Registering it in routes/exports.js

No refactoring required.

📌 Known Limitations

Export jobs are stored in memory (reset on restart)

Benchmark endpoint not enabled by default

No authentication layer (out of scope)

🏯 Why This Project Matters

This project demonstrates:

Real-world streaming patterns

Efficient handling of massive datasets

Practical Docker + PostgreSQL usage

Trade-offs between data formats

It mirrors problems solved daily in data platforms, reporting systems, and backend services at scale.

✅ Status

✔ Database seeded with 10,000,000 rows
✔ Streaming exports functional
✔ Memory-efficient design
✔ Production-ready containerization

📄 License

MIT License


---

### ✅ What you should do next
1. Paste this into `README.md`
2. Commit it:
```bash
git add README.md
git commit -m "Add comprehensive project README"

If you want, next I can:

polish this for resume/interview submission

shorten it for GitHub showcase

add benchmark section

add gzip documentation

Just tell me 👌
````













