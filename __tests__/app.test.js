const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const Book = require('../lib/models/Book');

describe('local-book-shoppe routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('/books should return a list of books', async () => {
    const resp = await request(app).get('/books');
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual([
      { id: '1', title: 'Lord of the Rings', released: 1922 },
      { id: '2', title: 'Animal Farm', released: 1945 },
    ]);
  });

  it('/books/:id should return book detail', async () => {
    const res = await request(app).get('/books/1');
    const lotr = {
      id: '1',
      title: 'Lord of the Rings',
      released: 1922,
      authors: [
        {
          author_id: 1, 
          name: 'J.R.R. Tolkien',
          dob: '1892-01-03',
          pob: 'Bloemfontein, Orange Free State'
        }
      ],
    };
    expect(res.body).toEqual(lotr);
  });

  it.skip('should add a new book', async () => {
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
