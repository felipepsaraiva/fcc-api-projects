-- Up
CREATE TABLE url (
  id VARCHAR PRIMARY KEY,
  original VARCHAR
);

INSERT INTO url VALUES ('2zEjBV', 'https://www.google.com');

-- Down
DROP TABLE url
