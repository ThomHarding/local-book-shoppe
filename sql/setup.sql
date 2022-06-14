-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS author_books;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS authors;

CREATE TABLE authors (
  author_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR NOT NULL,
  dob VARCHAR NOT NULL,
  pob VARCHAR NOT NULL
);

CREATE TABLE books (
  book_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR NOT NULL,
  released INT NOT NULL
);

CREATE TABLE author_books (
  author_book_id BIGINT GENERATED ALWAYS AS IDENTITY,
  book_id INT NOT NULL,
  author_id INT NOT NULL,
  FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE
);

INSERT INTO authors (
  name,
  dob,
  pob
)
VALUES 
  ('J.R.R. Tolkien', 'Sun Jan 03 1892', 'Bloemfontein, Orange Free State')
;

INSERT INTO books(
  title,
  released
)
VALUES
  ('Lord of the Rings', 1922)
  ;

INSERT INTO author_books (
    author_id,
    book_id
)
VALUES
  (1, 1)
;