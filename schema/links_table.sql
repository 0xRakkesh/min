CREATE TABLE link_table (
             id SERIAL PRIMARY KEY,
             target_url TEXT NOT NULL,
             short_id VARCHAR(10) NOT NULL UNIQUE,
             clicks INT DEFAULT 0
             
);

ALTER SEQUENCE link_table_id_seq RESTART WITH 1000000000;

