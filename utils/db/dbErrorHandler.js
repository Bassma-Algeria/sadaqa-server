const handleDbError = (error, res) => {
  console.error(error.stack);
  return res.status(505).json({ success: false, err: error.stack });
};

module.exports = { handleDbError };
