const db = require("../../db/index");
const { handleDbError } = require("../../utils/db/dbErrorHandler");

const addVisit = async (req, res) => {
  try {
    const { userId, device } = req.body;

    const query = `
      INSERT INTO visits (user_id, device)
      VALUES ($1, $2)
    `;
    const values = [userId, device];

    await db.query(query, values);

    res.status(200).json({ success: true, data: "visit added successfully" });
  } catch (error) {
    handleDbError(error, res);
  }
};

module.exports = { addVisit };
