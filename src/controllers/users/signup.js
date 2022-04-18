const db = require("../../db/index");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const {
  uploadImageAndShareIt,
} = require("../../utils/driveAndGmail/driveFunctions");
const {
  encriptPasswordAndReturnTheHash,
} = require("../../utils/users/encriptPassword");
const { generateToken } = require("../../utils/users/generateToken");
const { generateUsername } = require("../../utils/users/generateUsername");
const { validateSignupInfo } = require("../../utils/users/validations");
const {
  ASSOCIATIONS_DOCS_FILE_ID,
} = require("../../utils/driveAndGmail/driveFilesIds");
const { sendEmail } = require("../../utils/driveAndGmail/gmailFunctions");
const {
  getAssociationDemandeHtmlEmailTemplate,
} = require("../../utils/emailTemplates/associationDemande");

const ASSOCIATION_ROLE_ID = 2;

const signupUser = async (req, res) => {
  const errors = await validateSignupInfo({
    ...req.body,
    associationDocs: req.files,
    res,
  });
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    const userId = await addUserWithRealValuesAndReturnHisId(client, req, res);
    await addProfilePicWithDefaultValues(userId, client, res);
    await addUserPreferencesWithDefaultValues(userId, client, res);
    await addSocialLinksWithDefaultValues(userId, client, res);

    if (Number(req.body.roleId) === ASSOCIATION_ROLE_ID) {
      sendAssociationRequestEmailToAdmin({
        ...req.body,
        associationId: userId,
        associationDocs: req.files,
      });
    }

    await client.query("COMMIT");
    const token = generateToken(userId);

    return res
      .status(200)
      .json({ success: true, data: { token: `Bearer ${token}` } });
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  } finally {
    client.release();
  }
};

const addUserWithRealValuesAndReturnHisId = async (client, req, res) => {
  try {
    const query = `
      INSERT INTO users (association_name, first_name, last_name, username, birthday, gender, wilaya, commun, phone_num, role_id, email, password, active)

      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING user_id
    `;
    const values = await parseAndReturnValuesToInsert({ ...req.body, res });

    const {
      rows: [result],
    } = await client.query(query, values);

    return result.user_id;
  } catch (error) {
    handleDbError(error, res);
  }
};

const parseAndReturnValuesToInsert = async ({
  associationName,
  firstName,
  lastName,
  birthday: receivedBirthday,
  gender,
  wilaya,
  commun,
  phoneNum,
  roleId,
  email,
  password: receivedPassword,
  res,
}) => {
  const username = await generateUsername(
    firstName,
    lastName,
    associationName,
    roleId,
    res
  );
  const password = await encriptPasswordAndReturnTheHash(
    receivedPassword.trim(),
    res
  );
  const birthday = Number(roleId) === 1 ? receivedBirthday : null;
  const active = Number(roleId) === 1 ? true : false;

  const parsedValues = [
    associationName.trim(),
    firstName.trim(),
    lastName.trim(),
    username.trim(),
    birthday && birthday.trim(),
    gender.toLowerCase(),
    wilaya.replace(/\d|-/g, "").trim().toLowerCase(),
    commun.toLowerCase(),
    phoneNum.trim(),
    Number(roleId),
    email.trim(),
    password,
    active,
  ];

  return parsedValues;
};

const addUserPreferencesWithDefaultValues = async (userId, client, res) => {
  try {
    const query = `
      INSERT INTO users_preferences (user_id, language, display_mode)
      VALUES ($1, 'ar', 'light')
    `;
    const values = [userId];

    await client.query(query, values);
  } catch (error) {
    handleDbError(error, res);
  }
};

const addProfilePicWithDefaultValues = async (userId, client, res) => {
  const tempGoogleDriveId = (Math.random() * 1000000000).toString();
  try {
    const query = `
      INSERT INTO user_photos (g_drive_photo_id, user_id)
      VALUES ($1, $2)
    `;
    const values = [tempGoogleDriveId, userId];

    await client.query(query, values);
  } catch (error) {
    handleDbError(error, res);
  }
};

const addSocialLinksWithDefaultValues = async (userId, client, res) => {
  try {
    const query = `
      INSERT INTO social_links (user_id, platform)
      VALUES
        ($1, 'facebook'),
        ($1, 'instagram'),
        ($1, 'linkedin'),
        ($1, 'whatsapp'),
        ($1, 'viber')
    `;
    const values = [userId];

    await client.query(query, values);
  } catch (error) {
    handleDbError(error, res);
  }
};

const sendAssociationRequestEmailToAdmin = async (args) => {
  try {
    const imagesIds = [];

    for (const associationDoc of args.associationDocs) {
      const imageId = await uploadImageAndShareIt(
        associationDoc,
        ASSOCIATIONS_DOCS_FILE_ID
      );
      imagesIds.push(imageId);
    }

    const htmlEmailTemplate = getAssociationDemandeHtmlEmailTemplate({
      ...args,
      imagesIds,
    });
    const emailTitle = "Association Demande To Join Sadaqa";

    await sendEmail(htmlEmailTemplate, emailTitle);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { signupUser };
