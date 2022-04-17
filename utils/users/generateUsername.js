const { handleDbError } = require("../db/dbErrorHandler");
const { isUserExist } = require("./isUserExist");

const NORMAL_USER_ROLE_ID = 1;

const generateUsername = async (
  firstName,
  lastName,
  associationName,
  roleId,
  res
) => {
  var username;
  if (roleId === NORMAL_USER_ROLE_ID) {
    username = await generateNormalUsername(firstName, lastName, res);
  } else {
    username = await generateAssociationUsername(associationName, res);
  }

  return username;
};

async function generateNormalUsername(firstName, lastName, res) {
  try {
    var username = firstName + "_" + lastName;
    var isExist = await isUserExist({ username });
    if (isExist) {
      username = firstName + "-" + lastName;

      isExist = await isUserExist({ username });
      if (isExist) {
        username = firstName + lastName;
      }

      isExist = await isUserExist({ username });
      while (isExist) {
        // generate a random number(conatain 3 numbers) and add it to username
        const randomNum = Math.round(Math.random() * 1000);
        username = firstName + "-" + lastName + randomNum;

        isExist = await isUserExist({ username });
      }
    }

    return username;
  } catch (error) {
    handleDbError(error, res);
  }
}

async function generateAssociationUsername(associationName, res) {
  try {
    var username = associationName.replace(" ", "_");
    var isExist = await isUserExist({ username });
    if (isExist) {
      username = associationName.replace(" ", "-");

      isExist = await isUserExist({ username });
      if (isExist) {
        username = associationName.replace(" ", "");
      }

      isExist = await isUserExist({ username });
      while (isExist) {
        // generate a random number(conatain 3 numbers) and add it to username
        const randomNum = Math.round(Math.random() * 1000);
        username = associationName.replace(" ", "-") + randomNum;

        isExist = await isUserExist({ username });
      }
    }

    return username;
  } catch (error) {
    handleDbError(error, res);
  }
}

module.exports = { generateUsername };
