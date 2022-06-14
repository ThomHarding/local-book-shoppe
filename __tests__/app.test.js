const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

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

  
  it('/authors should return a list of authors', async () => {
    const resp = await request(app).get('/authors');
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual([
      { id: '1',
        name: 'J.R.R. Tolkien'
      },
      { id: '2',
        name: 'George Orwell'
      },
    ]);
  });

  it('/authors/:id should return author detail', async () => {
    const res = await request(app).get('/authors/1');
    const tolkien = {
      id: '1', 
      name: 'J.R.R. Tolkien',
      dob: '1892-01-03T07:00:00.000Z',
      pob: 'Bloemfontein, Orange Free State',
      books: [
        {
          book_id: 1,
          title: 'Lord of the Rings',
          released: 1922
        }
      ],
    };
    expect(res.body).toEqual(tolkien);
  });

  it('POST /authors should create a new author', async () => {
    const resp = await request(app).post('/authors').send({ name: 'You, reading this', dob: 'Jun 14 2022', pob: 'Alchemy Code Lab' });
    expect(resp.status).toBe(200);
    expect(resp.body.name).toBe('You, reading this');
  });

  it('POST /authors should create a new author with an associated book', async () => {
    const resp = await request(app)
      .post('/authors')
      .send({ name: 'Geoffrey Chaucer', dob: 'Sep 10 1340', pob: 'London', bookIds: [1, 2] });
    expect(resp.status).toBe(200);
    expect(resp.body.name).toBe('Geoffrey Chaucer');
    const { body: newAuthor } = await request(app).get(`/authors/${resp.body.id}`);
    expect(newAuthor.books.length).toBe(2);
  });

  afterAll(() => {
    pool.end();
  });
});
