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

  it('POST /books should create a new book', async () => {
    const resp = await request(app).post('/books').send({ title: 'The Dark Tower', released: '2014' });
    console.log(resp.status);
    expect(resp.status).toBe(200);
    expect(resp.body.title).toBe('The Dark Tower');
  });

  it('POST /books should create a new book with an associated Author', async () => {
    const resp = await request(app)
      .post('/books')
      .send({ title: 'Big Lordther', released: 2022, authorIds: [1, 2] });
    expect(resp.status).toBe(200);
    expect(resp.body.title).toBe('Big Lordther');

    const { body: newBook } = await request(app).get(`/books/${resp.body.id}`);
    expect(newBook.authors.length).toBe(2);
  });

  afterAll(() => {
    pool.end();
  });
});
