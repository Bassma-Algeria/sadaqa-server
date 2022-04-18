const db = require("../../db");
const { handleDbError } = require("../../utils/db/dbErrorHandler");

const getAllAssociations = async (req, res) => {
  try {
    const query = `
      SELECT U.user_id, association_name, commun, wilaya, link AS profile_pic
      FROM users AS U

      INNER JOIN user_photos AS up
      ON U.user_id = up.user_id

      WHERE role_id = $1
      ORDER BY U.created_at
    `;
    const values = [2];

    const { rows: associationsList } = await db.query(query, values);

    return res.status(200).json({ success: true, data: associationsList });
  } catch (error) {
    handleDbError(error, res);
  }
};

const getAssociationPerWilaya = async (req, res) => {
  try {
    const { wilaya } = req.query;

    const query = `
      SELECT U.user_id, association_name, commun, wilaya, link AS profile_pic
      FROM users AS U

      INNER JOIN user_photos AS up
      ON U.user_id = up.user_id
      
      WHERE role_id = $1 AND wilaya = $2
      ORDER BY U.created_at
    `;
    const values = [2, wilaya];

    const { rows: associationsList } = await db.query(query, values);

    return res.status(200).json({ success: true, data: associationsList });
  } catch (error) {
    handleDbError(error, res);
  }
};

module.exports = { getAllAssociations, getAssociationPerWilaya };
