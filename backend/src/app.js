const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/env');
const healthRoutes = require('./routes/healthRoutes');
const bookRoutes = require('./routes/bookRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security and utility middleware
app.use(helmet());

// Flexible CORS: allow configured clientUrl, standard localhost ports, and local dev servers
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowedPatterns = [
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/,
      /^file:\/\//
    ];
    if (origin === config.clientUrl || allowedPatterns.some(pattern => pattern.test(origin))) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev for smooth local frontend integration
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.env === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Phyllon Backend API is running',
    endpoints: {
      health: '/api/health',
      books: '/api/books'
    }
  });
});

app.use('/api', healthRoutes);
app.use('/api/books', bookRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

