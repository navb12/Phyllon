const bookService = require('../services/bookService');

const getBooks = async (req, res, next) => {
  try {
    const { mood, q } = req.query;
    const books = await bookService.getAllBooks({ mood, search: q });
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    next(error);
  }
};

const getBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await bookService.getBookById(id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

const searchBooks = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }
    const results = await bookService.searchBooks(q);
    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    next(error);
  }
};

const importBook = async (req, res, next) => {
  try {
    const bookData = req.body;
    if (!bookData || !bookData.title || !bookData.author) {
      return res.status(400).json({ success: false, message: 'Title and author are required' });
    }
    const savedBook = await bookService.importExternalBook(bookData);
    res.status(201).json({ success: true, data: savedBook });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getBook,
  searchBooks,
  importBook
};

