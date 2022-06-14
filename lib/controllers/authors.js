const { Router } = require('express');
const Author = require('../models/Author');

module.exports = Router()
  .get('/:id', async(req, res) => {
    const id = req.params.id;
    const matchingAuthor = await Author.getById(id);
    res.json(matchingAuthor[0]);
  })

  .get('/', async(req, res) => {
    const authors = await Author.getAll();
    res.json(authors);
  })

  .post('/', async (req, res, next) => {
    try {
      const author = await Author.insert(req.body);
      if (req.body.bookIds) {
        await Promise.all(req.body.bookIds.map((id) => author.addBookById(id)));
      }
      res.json(author);
    } catch (e) {
      next(e);
    }
  });
