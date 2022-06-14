const pool = require('../utils/pool');

module.exports = class Book { 
  id;
  title;
  released;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.released = row.released;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT id, title, released FROM Books;');
    return rows.map((row) => new Book(row));
  }
  
  static async getById(id) {
    const { rows } = await pool.query('SELECT b.title, b.released, a.name FROM authors a LEFT JOIN author_books ab ON ab.author_id = a.author_id LEFT JOIN books b ON b.book_id = ab.book_id WHERE b.book_id=$1;', [id]);
    // needs the aggregate thing to make it return an array of auhors but i don't wanna do that yet
    return rows.map((row) => new Book(row));
  }
};
