const app = require('./app');
const config = require('./config/env');

const server = app.listen(config.port, () => {
  console.log(`Phyllon backend running in ${config.env} mode`);
  console.log(`> Local: http://localhost:${config.port}`);
  console.log(`> Health: http://localhost:${config.port}/api/health`);
  console.log(`> Books:  http://localhost:${config.port}/api/books`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

