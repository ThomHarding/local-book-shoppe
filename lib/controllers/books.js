const { Router } = require('express');
const Book = require('../models/Book');

module.exports = Router()
  .get('/:id', async(req, res) => {
    const id = req.params.id;
    const matchingBook = await Book.getById(id);
    res.json(matchingBook[0]);
  })

  .get('/', async(req, res) => {
    const books = await Book.getAll();
    res.json(books);
  })

  .post('/', async (req, res, next) => {
    try {
      const book = await Book.insert(req.body);
      if (req.body.authorIds) {
        await Promise.all(req.body.authorIds.map((id) => book.addAuthorById(id)));
      }
      res.json(book);
    } catch (e) {
      next(e);
    }
  });
