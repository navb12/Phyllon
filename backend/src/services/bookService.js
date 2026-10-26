const prisma = require('../config/prisma');
const externalBookService = require('./externalBookService');

const searchBooks = async (query) => {
  return await externalBookService.searchExternalBooks(query);
};

const importExternalBook = async (bookData) => {
  const { title, author, description, pageCount, colors, moods } = bookData;

  // Check if book already exists in local DB
  const existing = await prisma.book.findFirst({
    where: {
      title: { equals: title, mode: 'insensitive' },
      author: { equals: author, mode: 'insensitive' }
    }
  });

  if (existing) {
    return existing;
  }

  // Create new entry in database
  return await prisma.book.create({
    data: {
      title,
      author,
      description: description || 'No description available.',
      pageCount: Number(pageCount) || 300,
      colors: colors && colors.length ? colors : ['#294638', '#122219'],
      moods: moods && moods.length ? moods : ['Curious']
    }
  });
};

const getAllBooks = async (filter = {}) => {
  const { mood, search } = filter;
  const where = {};

  if (mood) {
    where.moods = {
      has: mood
    };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { author: { contains: search, mode: 'insensitive' } }
    ];
  }

  return await prisma.book.findMany({
    where,
    orderBy: { id: 'asc' }
  });
};

const getBookById = async (id) => {
  return await prisma.book.findUnique({
    where: { id: Number(id) }
  });
};

module.exports = {
  getAllBooks,
  getBookById,
  searchBooks,
  importExternalBook
};

