const bcrypt = require("bcrypt");

async function encriptPasswordAndReturnTheHash(password, res) {
  try {
    const hash = await bcrypt.hash(password, 10);

    return hash;
  } catch (error) {
    return res.status(505).json({ success: false, error: err });
  }
}

module.exports = { encriptPasswordAndReturnTheHash };
