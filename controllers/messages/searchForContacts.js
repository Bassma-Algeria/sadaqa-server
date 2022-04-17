const db = require("../../db");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { getContact } = require("../../utils/messages/getContact");
const { getAuthUserId } = require("../../utils/users/getAuthUserId");

const searchForContacts = async (req, res) => {
  const currentUserId = getAuthUserId(req.headers);
  const { searchTerm } = req.params;
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    const targetUsersIds = await getTargetUsersIds(
      searchTerm.trim(),
      client,
      res
    );

    const contacts = await getTargetContacts(
      targetUsersIds,
      currentUserId,
      client,
      res
    );

    await client.query("COMMIT");
    return res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  } finally {
    client.release();
  }
};

const getTargetUsersIds = async (searchTerm, client, res) => {
  try {
    const conditionQuery = getQueryConditionStatment(searchTerm);

    const query = `
      select user_id 
      FROM users
      WHERE ${conditionQuery}
    `;
    const values = [];
    const { rows: usersIds } = await client.query(query, values);

    return usersIds;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const getQueryConditionStatment = (searchTerm) => {
  let conditionStatment = getQueryConditionStatmentForSingleWord(searchTerm);

  if (searchTerm.includes(" ")) {
    const firstWord = searchTerm.split(" ")[0];
    const secondWord = searchTerm.split(" ")[1];

    conditionStatment +=
      " OR " +
      getQueryConditionStatmentForSingleWord(firstWord) +
      " OR " +
      getQueryConditionStatmentForSingleWord(secondWord);
  }
  return conditionStatment;
};

const getQueryConditionStatmentForSingleWord = (searchTerm) => {
  return `
    first_name LIKE '%${searchTerm}%'
    OR last_name LIKE '%${searchTerm}%'
    OR username LIKE '%${searchTerm}%'
  `;
};

const getTargetContacts = async (usersIds, currentUserId, client, res) => {
  try {
    const contacts = [];
    for (const { user_id } of usersIds) {
      const contact = await getContact(user_id, currentUserId, client, res);
      contacts.push(contact);
    }
    return contacts;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

module.exports = { searchForContacts };
