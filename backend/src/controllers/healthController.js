const healthService = require('../services/healthService');

const getHealth = (req, res, next) => {
  try {
    const health = healthService.getSystemHealth();
    res.status(200).json({ success: true, data: health });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHealth };

