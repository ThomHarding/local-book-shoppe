const pool = require('../utils/pool');

module.exports = class Author { 
  id;
  name;
  dob;
  pob;
  books;

  constructor(row) {
    this.id = row.author_id;
    this.name = row.name;
    this.dob = row.dob;
    this.pob = row.pob;
    this.books = row.books;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM authors;');
    return rows.map((row) => new Author(row));
  }
  
  static async getById(id) {
    const { rows } = await pool.query('SELECT authors.*, COALESCE(json_agg(to_jsonb(books)) FILTER (WHERE books.book_id IS NOT NULL), \'[]\') as books from authors LEFT JOIN author_books on authors.author_id = author_books.author_id LEFT JOIN books on author_books.book_id = books.book_id WHERE books.book_id = 1 GROUP BY authors.author_id;', [id]);
    return rows.map((row) => new Author(row));
  }

  static async insert({ name, dob, pob }) {
    const { rows } = await pool.query(
      'INSERT INTO authors (name, dob, pob) VALUES ($1, $2) RETURNING *',
      [name, dob, pob]
    );
    return new Author(rows[0]);
  }

  async addAuthorById(bookId) {
    await pool.query(
      'INSERT INTO author_books (author_id, book_id) VALUES ($1, $2) RETURNING *',
      [this.id, bookId]
    );
    return this;
  }
};
