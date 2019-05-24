-- Up
CREATE TABLE url (
  id VARCHAR PRIMARY KEY,
  original VARCHAR
);

CREATE TABLE user (
  id INTEGER PRIMARY KEY,
  username VARCHAR NOT NULL UNIQUE
);

CREATE TABLE exercise (
  id INTEGER PRIMARY KEY,
  user INTEGER NOT NULL,
  description VARCHAR NOT NULL,
  duration INTEGER NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (user) REFERENCES user(id)
);

INSERT INTO url VALUES ('2zEjBV', 'https://www.google.com');

INSERT INTO user(username) VALUES ('admin');
INSERT INTO exercise(user, description, duration)
  VALUES (1, 'Atividade teste', 10);

-- Down
DROP TABLE url;
DROP TABLE user;
DROP TABLE exercise;
