const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const { Book } = require('../lib/models/Book');

describe('local-book-shoppe routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('should return a list of books', async () => {
    const res = await request(app).get('/books');
    const lotr = res.body.find((char) => char.book_id === '1');
    expect(lotr).toHaveProperty('title', 'Lord of the Rings');
    expect(lotr).toHaveProperty('released', 1922);
  });

  it('/books/:id should return book detail', async () => {
    const res = await request(app).get('/books/1');
    const lotr = {
      title: 'Lord of the Rings',
      released: 1922,
      authors: [
        {
          author_id: 1, 
          name: 'J.R.R. Tolkien'
        }
      ],
    };
    expect(res.body).toEqual(lotr);
  });

  it('should add a new book', async () => {
    const book = new Book({
      title: 'The Silmarillion',
      released: 1977
    });
    const res = await request(app).post('/books').send(book);
    expect(res.body.title).toEqual(book.title);
    expect(res.body.released).toEqual(book.released);
    const count = await book.count();
    expect(count).toEqual(2);
  });

  afterAll(() => {
    pool.end();
  });
});
