const pool = require('../utils/pool');

module.exports = class Book { 
  id;
  title;
  released;
  authors;

  constructor(row) {
    this.id = row.book_id;
    this.title = row.title;
    this.released = row.released;
    this.authors = row.authors;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM books;');
    return rows.map((row) => new Book(row));
  }
  
  static async getById(id) {
    const { rows } = await pool.query('SELECT books.*, COALESCE(json_agg(to_jsonb(authors)) FILTER (WHERE authors.author_id IS NOT NULL), \'[]\') as authors from books LEFT JOIN author_books on books.book_id = author_books.book_id LEFT JOIN authors on author_books.author_id = authors.author_id WHERE books.book_id = $1 GROUP BY books.book_id;', [id]);
    return rows.map((row) => new Book(row));
  }

  static async insert({ title, released }) {
    const { rows } = await pool.query(
      'INSERT INTO books (title, released) VALUES ($1, $2) RETURNING *',
      [title, released]
    );
    return new Book(rows[0]);
  }

  async addAuthorById(authorId) {
    await pool.query(
      'INSERT INTO author_books (book_id, author_id) VALUES ($1, $2) RETURNING *',
      [this.id, authorId]
    );
    return this;
  }
};
