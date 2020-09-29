
\c carbon_footprint

DROP TABLE IF EXISTS users; 
DROP TABLE IF EXISTS results; 
DROP TABLE IF EXISTS takeaction; 

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username text NOT NULL,
    password text NOT NULL,
    email text
);

CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users ON DELETE CASCADE,
    food FLOAT,
    housing FLOAT,
    transport FLOAT,
    total FLOAT,
    posting_date TIMESTAMP default CURRENT_TIMESTAMP
);

CREATE TABLE takeaction (
    id SERIAL PRIMARY KEY,
    results_id INTEGER REFERENCES results ON DELETE CASCADE,
    public_transport FLOAT,
    carpool FLOAT,
    low_carbon_diet FLOAT,
    organic FLOAT,
    fridge FLOAT,
    green_electricity FLOAT
    
);

