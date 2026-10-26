const getSystemHealth = () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
};

module.exports = { getSystemHealth };

