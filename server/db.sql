CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE polls (
    id SERIAL PRIMARY KEY,
    poll_name VARCHAR(255),
    poll_password VARCHAR(255),
    password_hint VARCHAR(255),
    poll_timeout INTEGER
);

CREATE TABLE choices (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id),
    choice VARCHAR(255),
    votes INTEGER DEFAULT 0
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id),
    username VARCHAR(255),
    choice_id INTEGER REFERENCES choices(id)
);

ALTER TABLE polls
ALTER COLUMN poll_timeout DROP NOT NULL;