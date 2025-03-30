-- CREATE ROL
CREATE ROLE inventures WITH LOGIN SUPERUSER PASSWORD 'entrevista';

-- CREATE DB
CREATE DATABASE url;

-- CONNECT DB url
\c url;

-- CREATE TABLE urls
CREATE TABLE urls (
    url VARCHAR(255),
    short_url VARCHAR(255),
    clicks INT,
    fecha DATE,
    hora TIME
);

INSERT INTO urls (url, short_url, clicks, fecha, hora) 
VALUES ('https://example.com', 'ejem', 0, '2025-03-30', '12:00:00');

INSERT INTO urls (url, short_url, clicks, fecha, hora) 
VALUES ('https://oldURL.com', 'ejem', 0, '2025-01-01', '12:00:00');