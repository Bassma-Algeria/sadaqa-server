const db = require("../../db");
const { getPostWilaya, getPostTypeId, getPostTitle } = require("../../utils/posts/getPostProperties");

const DONATION_ID = 1;
const DONATION_REQUEST_ID = 2;
const NORMAL_USER_ROLE_ID = 1;
const ASSOCIATION_ROLE_ID = 2;

/**
 * this function create a notification for some specific users following the rules bellow:
 * 1 - The post is a donation (typeId = 1), we gonna notify the users who already
 *      post a donation request that still active and has a title or description similar to the new donation
 *      maybe it's what they are looking for.
 *
 * 2 - The post is a donation request (typeId = 2), we gonna notify the users who
 *      already post a donation and has a title or description similar to the new donation
 *      and still active, maybe it's what the first is looking for, also send a notification
 *      to all the users who have a role of normal user (roleId = 1) in the same wilaya
 *      maybe they can help
 *
 * 3 - Otherwise (typeId = 3 || 4), we gonna notify the users in the same wilaya
 *
 * 4 - In case of associations (roleId = 2), we just notify theme
 *      if the post is in the same wilaya as they are.
 *
 *  And in all those cases we didn't notify the user who post it of course
 */
const createPostNotifications = async (postId, currentUserId) => {
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    const receiversIds = await getReceiversIds(postId, currentUserId, client);

    for (const receiverId of receiversIds) {
      await insertPostNotificationInDb(receiverId, postId);
    }

    await client.query("COMMIT");

    return { receiversIds };
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
  } finally {
    client.release();
  }
};

const getReceiversIds = async (postId, currentUserId, client) => {
  const targetAssociationsIds = await getUsersIdsInSameWilayaAsPost(postId, ASSOCIATION_ROLE_ID, client);

  const targetNormalUsersIds = await getTargetNormalUserIds(postId, client);

  // remove the duplicates and the current user
  let receiversIds = targetAssociationsIds.concat(targetNormalUsersIds);
  receiversIds = receiversIds.filter(
    (receiverId, index) => receiverId !== currentUserId && receiversIds.indexOf(receiverId) === index
  );

  return receiversIds;
};

const getTargetNormalUserIds = async (postId, client) => {
  const postTypeId = await getPostTypeId(postId, client);

  let targetUsers;
  if (postTypeId === DONATION_ID) {
    targetUsers = await getUsersIdsHasDonationRequestSimilarToThePost(postId, client);
  } else if (postTypeId === DONATION_REQUEST_ID) {
    targetUsers = await getUsersIdsHasDonationsSimilarToPost(postId, client);
    const normalUserInSameWilayaOfPost = await getUsersIdsInSameWilayaAsPost(
      postId,
      NORMAL_USER_ROLE_ID,
      client
    );
    targetUsers = targetUsers.concat(normalUserInSameWilayaOfPost);
  } else {
    targetUsers = getUsersIdsInSameWilayaAsPost(postId, NORMAL_USER_ROLE_ID, client);
  }

  return targetUsers;
};

const getUsersIdsInSameWilayaAsPost = async (postId, roleId, client) => {
  try {
    const postWilaya = await getPostWilaya(postId, client);
    const associationInSameWilaya = await getUsersIdsInSameWilayaAndHasSameRole(postWilaya, roleId, client);

    return associationInSameWilaya;
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
  }
};

const getUsersIdsInSameWilayaAndHasSameRole = async (postWilaya, userRoleId, client) => {
  try {
    const query = `
      SELECT user_id
      FROM users
      WHERE wilaya = $1 AND role_id = $2
    `;
    const values = [postWilaya, userRoleId];

    let { rows: targetUsersIds } = await client.query(query, values);

    // targetUsersIds = {user_id: ...}[] turn it to {user_Id}
    targetUsersIds = targetUsersIds.map((targetUserId) => {
      return targetUserId.user_id;
    });

    return targetUsersIds;
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
  }
};

const getUsersIdsHasDonationRequestSimilarToThePost = async (postId, client) => {
  try {
    let targetUsersIds = await getTargetPublishers(postId, 2, client);

    // targetUsersIds = {user_id: ...}[] turn it to {user_Id}
    targetUsersIds = targetUsersIds.map((targetUserId) => {
      return targetUserId.user_id;
    });

    return targetUsersIds;
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
  }
};

const getUsersIdsHasDonationsSimilarToPost = async (postId, client) => {
  try {
    let targetUsersIds = await getTargetPublishers(postId, 1, client);

    // targetUsersIds = {user_id: ...}[] turn it to {user_Id}
    targetUsersIds = targetUsersIds.map((targetUserId) => {
      return targetUserId.user_id;
    });

    return targetUsersIds;
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
  }
};

const getTargetPublishers = async (postId, typeId, client) => {
  try {
    // get the title of the post and get the first two words of it
    const postTitle = await getPostTitle(postId, client);
    const tsqueryArgument = postTitle
      .trim()
      .split(" ")
      .filter((word, index) => index < 2)
      .join(" <-> ");

    const query = `
      SELECT users.user_id
      FROM posts 
      INNER JOIN users
      ON posts.user_id = users.user_id
      WHERE type_id = $1 AND posts.active = true AND role_id = 1
      AND (title_tokens @@ to_tsquery('${tsqueryArgument}') OR description_tokens @@ to_tsquery('${tsqueryArgument}'))
    `;
    const values = [typeId];

    const { rows: usersIds } = await client.query(query, values);

    return usersIds; // usersIds = {user_id}[]
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error);
  }
};

const insertPostNotificationInDb = async (receiverId, postId) => {
  try {
    const query = `
      WITH insert_into_notifications AS (
        INSERT INTO notifications (notification_type, receiver_id)
        VALUES ($1, $2)
        RETURNING notification_id
      )
      INSERT INTO post_notifications (notification_id, post_id)
      select notification_id, $3 from insert_into_notifications

      RETURNING post_notifications.notification_id
    `;

    const values = ["post", receiverId, postId];

    const {
      rows: [result],
    } = await db.query(query, values);

    return result.notification_id;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createPostNotifications };
