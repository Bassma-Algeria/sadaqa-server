const db = require("../../db");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { getAuthUserId } = require("../../utils/users/getAuthUserId");

const getNumOfPostsOfAuthUser = async (req, res) => {
  const currentUserId = getAuthUserId(req.headers);
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    const numOfDonations = await getNumOfPostsOfType(
      currentUserId,
      "donation",
      client,
      res
    );
    const numOfDonationRequests = await getNumOfPostsOfType(
      currentUserId,
      "donation_request",
      client,
      res
    );
    const numOfCallForHelps = await getNumOfPostsOfType(
      currentUserId,
      "call_for_help",
      client,
      res
    );
    const numOfFamiliesInNeed = await getNumOfPostsOfType(
      currentUserId,
      "family_in_need",
      client,
      res
    );
    const totalNumOfPosts =
      numOfCallForHelps.total +
      numOfDonationRequests.total +
      numOfDonations.total +
      numOfFamiliesInNeed.total;

    await client.query("COMMIT");
    return res.status(200).json({
      success: true,
      data: {
        totalNumOfPosts,
        numOfCallForHelps,
        numOfDonationRequests,
        numOfFamiliesInNeed,
        numOfDonations,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  } finally {
    client.release();
  }
};

const getNumOfPostsOfType = async (userId, typeId, client, res) => {
  const total = await getTotalNumOfPostsOfType(userId, typeId, client, res);
  const active = await getTotalNumOfActivePostsOfType(
    userId,
    typeId,
    client,
    res
  );

  return { total, active };
};

const getTotalNumOfPostsOfType = async (userId, typeId, client, res) => {
  try {
    const query = `
      SELECT active
      FROM posts
  
      INNER JOIN post_types
      ON posts.type_id = post_types.type_id
  
      WHERE user_id = $1 AND type = $2
    `;
    const values = [userId, typeId];

    const { rowCount } = await client.query(query, values);

    return rowCount;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const getTotalNumOfActivePostsOfType = async (userId, typeId, client, res) => {
  try {
    const query = `
      SELECT active
      FROM posts
  
      INNER JOIN post_types
      ON posts.type_id = post_types.type_id
  
      WHERE user_id = $1 AND type = $2 AND active = true
    `;
    const values = [userId, typeId];

    const { rowCount } = await client.query(query, values);

    return rowCount;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

module.exports = { getNumOfPostsOfAuthUser };
