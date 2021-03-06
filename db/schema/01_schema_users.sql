DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS resources CASCADE;
-- DROP TABLE IF EXISTS comments CASCADE;
-- DROP TABLE IF EXISTS resource_rates CASCADE;
-- DROP TABLE IF EXISTS resource_likes CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(32),
  password VARCHAR(255) NOT NULL,
  start_date DATE,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

-- CREATE TABLE resources (
--   id SERIAL PRIMARY KEY NOT NULL,
--   title VARCHAR(255) NOT NULL,
--   description TEXT,
--   thumbnail_photo_url VARCHAR(255) NOT NULL,
--   cover_photo_url VARCHAR(255) NOT NULL,
--   topic VARCHAR(255) NOT NULL,
--   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   creation_date DATE
-- );

-- CREATE TABLE comments (
--   id SERIAL PRIMARY KEY NOT NULL,
--   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
--   comment TEXT,
-- );

-- CREATE TABLE resource_rates (
--   id SERIAL PRIMARY KEY NOT NULL,
--   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
--   rating SMALLINT NOT NULL DEFAULT 0,
-- );

-- CREATE TABLE resource_likes (
--   id SERIAL PRIMARY KEY NOT NULL,
--   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
--   like SMALLINT NOT NULL DEFAULT 0,
-- );
