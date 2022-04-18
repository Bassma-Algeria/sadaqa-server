const bcrypt = require("bcrypt");
const db = require("../../db/index");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { generateToken } = require("../../utils/users/generateToken");
const { validateLoginInfo } = require("../../utils/users/validations");

const loginUser = async (req, res) => {
  const errors = validateLoginInfo(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const { email, password } = req.body;

  try {
    const { userId, passwordHash } =
      await getUserUsingEmailAndReturnHisIdAndPassword(email.trim(), res);
    if (!userId) return;

    const isPasswordMath = await bcrypt.compare(password, passwordHash);

    if (isPasswordMath) {
      const token = generateToken(userId);
      return res
        .status(200)
        .json({ success: true, data: { token: `Bearer ${token}` } });
    } else {
      errors.credentials = "Wrong credentials please try again.";
      return res.status(400).json({ success: false, errors });
    }
  } catch (error) {
    handleDbError(error, res);
  }
};

const getUserUsingEmailAndReturnHisIdAndPassword = async (email, res) => {
  try {
    const query = `
      SELECT user_id, password
      FROM users 
      WHERE email = $1
    `;
    const values = [email];

    const {
      rows: [result],
      rowCount,
    } = await db.query(query, values);

    if (rowCount === 0) {
      const errors = { credentials: "Wrong credentials please try again." };
      return res.status(400).json({ success: false, errors });
    }

    return { userId: result.user_id, passwordHash: result.password };
  } catch (error) {
    handleDbError(error, res);
  }
};

module.exports = { loginUser };
