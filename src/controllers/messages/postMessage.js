const db = require("../../db");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { getAuthUserId } = require("../../utils/users/getAuthUserId");

const postMessage = async (req, res) => {
  const currentUserId = getAuthUserId(req.headers); // senderId
  const { content, receiverId } = req.body;

  try {
    const query = `
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES ($1, $2, $3)
      RETURNING message_id, sender_id, receiver_id, content, read, created_at
    `;
    const values = [currentUserId, receiverId, content];

    const {
      rows: [result],
    } = await db.query(query, values);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    handleDbError(error, res);
  }
};

module.exports = { postMessage };
