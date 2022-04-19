const jwt = require("jsonwebtoken");

// check for the user if autheticated and return his id
const getAuthUserId = ({ authorization }) => {
  const token = authorization.split("Bearer ")[1];
  const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

  return userId;
};

module.exports = { getAuthUserId };
