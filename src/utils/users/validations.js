const bcrypt = require("bcrypt");
const db = require("../../db");
const { handleDbError } = require("../db/dbErrorHandler");
const { getUserPasswordHash } = require("./getUserPasswordHash");
const { getUserRoleId } = require("./getUserRoleId");
const { isUserExist } = require("./isUserExist");

const validateSignupInfo = async ({
  associationName,
  firstName,
  lastName,
  birthday,
  gender,
  wilaya,
  commun,
  phoneNum,
  roleId,
  email,
  password,
  confirmPassword,
  associationDocs,
  res,
}) => {
  const errors = {};

  if (Number(roleId) === 1) {
    // normal users
    if (firstName.trim() === "") errors.firstName = "Must Not be empty";
    if (lastName.trim() === "") errors.lastName = "Must Not be empty";
    if (birthday.toString() === "null") errors.birthday = "Must Not be empty";
    if (gender === "") errors.gender = "Must Not be empty";
  } else {
    if (associationName === "") errors.associationName = "Must Not be empty";

    if (associationDocs.length === 0) {
      errors.associationDocs = "Must Provide at lease one legal document";
    } else {
      let isAllDocsAreImages = true;
      associationDocs.map((doc) => {
        if (!doc.mimetype.includes("image")) {
          isAllDocsAreImages = false;
        }
      });
      if (!isAllDocsAreImages) errors.associationDocs = "Only images accepted";
    }
  }
  if (wilaya.trim() === "null") errors.wilaya = "Must Not be empty";
  if (commun === "") errors.commun = "Must Not be empty";
  if (isValidPhoneNumber(phoneNum))
    errors.phoneNum = "Must be a valid phone number";
  if (roleId === null) errors.roleId = "Must Not be empty";
  if (password.trim() === "") errors.password = "Must Not be empty";

  if (confirmPassword.trim() === "") {
    errors.confirmPassword = "Must Not be empty";
  } else if (confirmPassword.trim() !== password) {
    errors.confirmPassword = "Password must match";
  }

  if (email.trim() === "") {
    errors.email = "Must not be empty";
  } else {
    const regex =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    if (!email.match(regex)) {
      errors.email = "Must be a valide email";
    } else {
      const isEmailExist = await isUserExist({ email, res });

      if (isEmailExist) {
        errors.email = "Email already in use";
      }
    }
  }

  return errors;
};

const validateLoginInfo = ({ email, password }) => {
  const errors = {};

  if (email === "") {
    errors.email = "Must not be empty";
  } else {
    const regex =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    if (!email.match(regex)) errors.email = "Must be a valide email";
  }

  if (password === "") errors.password = "Must Not be empty";

  return errors;
};

const validateGeneralEditedInfo = async ({
  userId,
  associationName,
  firstName,
  lastName,
  username,
  birthday,
  gender,
  wilaya,
  commun,
  adress,
  phoneNum,
  socialAccounts,
  profilePic,
  client,
  res,
}) => {
  try {
    const errors = {};

    const roleId = await getUserRoleId(userId, client, res);

    if (roleId === 1) {
      // normal users
      if (firstName === "") errors.firstName = "Must Not be empty";
      if (lastName === "") errors.lastName = "Must Not be empty";
      if (birthday.toString() === "") errors.birthday = "Must Not be empty";
      if (gender === "") errors.gender = "Must Not be empty";
    } else {
      if (associationName === "") errors.associationName = "Must Not be empty";
    }
    if (wilaya === "") errors.wilaya = "Must Not be empty";
    if (commun === "") errors.commun = "Must Not be empty";
    if (adress === "") errors.adress = "Must Not be empty";
    if (isValidPhoneNumber(phoneNum))
      errors.phoneNum = "Must be a valid phone number";

    const isUsernameUsed = await isUserExist({ username, userId, res });
    if (isUsernameUsed) errors.username = "Username already exist";

    if (profilePic) {
      if (!profilePic.mimetype.includes("image")) {
        errors.postPhotos = "Only images accepted";
      }
    }

    for (let i = 0; i < socialAccounts.length; i++) {
      const { platform, link } = socialAccounts[i];

      const regexToCheckForUrlLinks =
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

      if (link && !link.match(regexToCheckForUrlLinks)) {
        errors[`${platform}Link`] = "Must be a valid link";
      }
    }

    return errors;
  } catch (error) {
    handleDbError(error, res);
  }
};

const validateEditedCredentials = async ({
  userId,
  email,
  oldPassword,
  newPassword,
  confirmNewPassword,
  res,
}) => {
  try {
    const errors = {};

    if (email === "") {
      errors.email = "Must not be empty";
    } else {
      const regex =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

      if (!email.match(regex)) {
        errors.email = "Must be a valide email";
      } else {
        const isEmailExist = await isUserExist({ email, userId, res });

        if (isEmailExist) {
          errors.email = "Email already in use";
        }
      }
    }

    if (oldPassword === "") {
      errors.oldPassword = "Most not be empty";
    } else {
      const isOldPasswordCorrect = await isPasswordCorrect(
        oldPassword,
        userId,
        res
      );
      if (!isOldPasswordCorrect) errors.oldPassword = "Password incorrect";
    }

    if (newPassword === "") errors.newPassword = "Must Not be empty";
    if (confirmNewPassword === "") {
      errors.confirmNewPassword = "Must Not be empty";
    } else if (confirmNewPassword !== newPassword) {
      errors.confirmNewPassword = "NewPassword must match";
    }

    return errors;
  } catch (error) {
    handleDbError(error, res);
  }
};

const isPasswordCorrect = async (password, userId, res) => {
  const passwordHash = await getUserPasswordHash(userId, res);
  const isPasswordMatch = await bcrypt.compare(password, passwordHash);
  if (isPasswordMatch) {
    return true;
  }
  return false;
};

const validatePostCreationInputs = ({
  title,
  wilaya,
  commun,
  typeId,
  category,
  postPhotos,
}) => {
  const errors = {};

  if (title === "") errors.title = "Must Not be empty";
  if (wilaya === "") errors.wilaya = "Must Not be empty";
  if (commun === "") errors.commun = "Must Not be empty";
  if (typeId === "") {
    errors.typeId = "Must Choose a post type";
  } else if (Number(typeId) === 1 || Number(typeId) === 2) {
    if (category === "") errors.category = "Must Choose a category";
  }

  if (postPhotos.length > 0) {
    let isAllPhotosSendedAreImages = true;
    postPhotos.map((photo) => {
      if (!photo.mimetype.includes("image")) {
        isAllPhotosSendedAreImages = false;
      }
    });
    if (!isAllPhotosSendedAreImages) errors.postPhotos = "Only images accepted";
  }

  return errors;
};

const isValidPhoneNumber = (phoneNum) =>
  !Number(phoneNum.replace(/ /g, "")) ||
  phoneNum.replace(/ /g, "").length !== 10;

module.exports = {
  validateSignupInfo,
  validateLoginInfo,
  validateGeneralEditedInfo,
  validateEditedCredentials,
  validatePostCreationInputs,
};
