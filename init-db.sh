#!/bin/bash
set -e

psql -U user -d exports_db <<EOF

CREATE TABLE IF NOT EXISTS records (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  value DECIMAL(18,4) NOT NULL,
  metadata JSONB NOT NULL
);

DO \$\$
BEGIN
  IF (SELECT COUNT(*) FROM records) = 0 THEN
    INSERT INTO records (name, value, metadata)
    SELECT
      'name_' || g,
      random() * 1000,
      jsonb_build_object(
        'index', g,
        'nested', jsonb_build_object(
          'flag', (g % 2 = 0),
          'score', random()
        )
      )
    FROM generate_series(1, 10000000) g;
  END IF;
END
\$\$;

EOF