const express = require('express');
const router = express.Router();
const { getBooks, getBook, searchBooks, importBook } = require('../controllers/bookController');

router.get('/', getBooks);
router.get('/search', searchBooks);
router.post('/import', importBook);
router.get('/:id', getBook);

module.exports = router;

