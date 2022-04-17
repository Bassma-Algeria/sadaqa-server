const db = require("../../db");
const { getAuthUserId } = require("../../utils/users/getAuthUserId");

const setPreferences = async (req, res) => {
  const currentUserId = getAuthUserId(req.headers);
  const preferences = req.query;

  try {
    const query = formAndRetunQueryDependOnPreferences(preferences);
    const values = [currentUserId];

    await db.query(query, values);

    return res
      .status(200)
      .json({ success: true, data: "Preference set successfully" });
  } catch (error) {
    await client.query("ROLLBACK");

    handleDbError(error, res);
  }
};

const formAndRetunQueryDependOnPreferences = (preferences) => {
  const columnsNames = Object.keys(preferences);
  const values = Object.values(preferences);

  const numOfPrefencesToSet = columnsNames.length;
  let querySETtext = "SET ";
  for (let i = 0; i < numOfPrefencesToSet; i++) {
    if (i === numOfPrefencesToSet - 1) {
      querySETtext += `${columnsNames[i]} = '${values[i]}' `;
    } else {
      querySETtext += `${columnsNames[i]} = '${values[i]}', `;
    }
  }

  return `
    UPDATE users_preferences
    ${querySETtext}
    WHERE user_id = $1
  `;
};

module.exports = { setPreferences };
