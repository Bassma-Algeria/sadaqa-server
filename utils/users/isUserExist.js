const db = require("../../db/index");
const { handleDbError } = require("../db/dbErrorHandler");

// check for the user if exist in the db by any property given
const isUserExist = async (property) => {
  try {
    const query = `
      SELECT user_id
      FROM users
      WHERE ${Object.keys(property)[0]} = $1
    `;
    const values = [Object.values(property)[0]];

    const {
      rowCount,
      rows: [result],
    } = await db.query(query, values);

    if (rowCount === 0) {
      return false;
    } else {
      /** this check is for the edit functions,
       *  we do this to allow the user to use the same email or username that he was using before
       */
      if (result.user_id === property.userId) {
        return false;
      }
    }

    return true;
  } catch (error) {
    handleDbError(error, property.res);
  }
};

module.exports = { isUserExist };
