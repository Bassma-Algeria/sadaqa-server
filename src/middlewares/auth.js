const db = require("../db/index");
const jwt = require("jsonwebtoken");
const { handleDbError } = require("../utils/db/dbErrorHandler");
const { isUserExist } = require("../utils/users/isUserExist");

// check for the user if authenticated
const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    const token = authorization.split("Bearer ")[1];

    // check if the userId exist
    try {
      const { userId: tokenUserId } = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      );

      const userExist = await isUserExist({ user_id: tokenUserId });

      if (!userExist) {
        return res.status(404).json({
          success: false,
          error:
            "Action not autorized, the user_id in the headers does not exist",
        });
      }

      next();
    } catch (error) {
      handleDbError(error, res);
    }
  } else {
    return res.status(401).json({
      success: false,
      error: "Action not autorized, no user_id in the headers",
    });
  }
};

module.exports = { auth };
