const db = require("../../db");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { getAuthUserId } = require("../../utils/users/getAuthUserId");

const getAuthUserNotifications = async (req, res) => {
  const userId = getAuthUserId(req.headers);
  const { numOfGroupe, numOfElementsPerGroupe } = req.query;

  const client = await db.getClient();

  try {
    await client.query("BEGIN");
    const postsNotifications = await getPostsNotifications(userId, client, res);

    const messagesNotifications = await getMessagesNotifications(
      userId,
      client,
      res
    );

    const likesNotifications = await getLikesNotifications(userId, client, res);

    const notificationsNeeded = concatNotificationsTypesAndReturnNeededOnes(
      postsNotifications,
      messagesNotifications,
      likesNotifications,
      numOfGroupe,
      numOfElementsPerGroupe
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      data: {
        notificationsNeeded,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  } finally {
    client.release();
  }
};

async function getPostsNotifications(userId, client, res) {
  try {
    const query = `
      SELECT p.post_id, type AS post_type, thumbnail_link AS notification_pic, n.notification_type, n.read,n.created_at
      FROM notifications AS n

      INNER JOIN post_notifications AS p_n
      ON p_n.notification_id = n.notification_id

      INNER JOIN posts AS p
      ON p.post_id = p_n.post_id
      
      INNER JOIN post_types AS p_t
      ON p.type_id = p_t.type_id

      WHERE n.receiver_id = $1
      ORDER BY n.created_at DESC
    `;
    const values = [userId];

    const { rows: postsNotifications } = await client.query(query, values);

    return postsNotifications;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
}

async function getMessagesNotifications(userId, client, res) {
  try {
    let messagesNotifications = await getAllMessagesNotifications(
      userId,
      client,
      res
    );
    if (messagesNotifications.length > 0) {
      messagesNotifications = rearrangeMessagesNotifications(
        messagesNotifications
      );
    }
    return messagesNotifications;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
}

async function getAllMessagesNotifications(userId, client, res) {
  try {
    const query = `
      SELECT m.sender_id, sender.first_name, sender.gender, sender.association_name, link AS notification_pic, m.content AS message_content, n.notification_type, n.read, n.created_at
      FROM notifications AS n

      INNER JOIN messages_notifications AS m_n
      ON m_n.notification_id = n.notification_id

      INNER JOIN messages AS m
      ON m.message_id = m_n.message_id

      INNER JOIN users AS sender
      ON sender.user_id = m.sender_id

      INNER JOIN user_photos AS u_p
      ON sender.user_id = u_p.user_id

      WHERE n.receiver_id = $1 AND m.read = false
      ORDER BY n.created_at DESC
    `;
    const values = [userId];

    const { rows: messagesNotifications } = await client.query(query, values);

    return messagesNotifications;
  } catch (error) {
    await client.query("ROLLBACK");

    handleDbError(error, res);
  }
}

const rearrangeMessagesNotifications = (messagesNotifications) => {
  const rearrangedMessagesNotifications = [];
  let numOfMessagesFromSameSender = 0;

  for (var i = 0; i < messagesNotifications.length - 1; i++) {
    numOfMessagesFromSameSender++;

    if (nextUserNotSameAsPrev(messagesNotifications, i, "sender_id")) {
      const indexOfLatestMessageFromSameSender =
        i - numOfMessagesFromSameSender + 1;

      const rearrangedMessageNotification = {
        ...messagesNotifications[i],
        created_at:
          messagesNotifications[indexOfLatestMessageFromSameSender].created_at,
        message_content:
          messagesNotifications[indexOfLatestMessageFromSameSender]
            .message_content,
        num_of_messages: numOfMessagesFromSameSender,
      };

      rearrangedMessagesNotifications.push(rearrangedMessageNotification);

      numOfMessagesFromSameSender = 0;
    }
  }
  const indexOfLatestMessageFromSameSender = i - numOfMessagesFromSameSender;

  const rearrangedMessageNotification = {
    ...messagesNotifications[i],
    created_at:
      messagesNotifications[indexOfLatestMessageFromSameSender].created_at,
    message_content:
      messagesNotifications[indexOfLatestMessageFromSameSender].message_content,
    num_of_messages: numOfMessagesFromSameSender + 1,
  };

  rearrangedMessagesNotifications.push(rearrangedMessageNotification);

  return rearrangedMessagesNotifications;
};

const nextUserNotSameAsPrev = (array, index, userProperty) => {
  return array[index][userProperty] !== array[index + 1][userProperty];
};

async function getLikesNotifications(userId, client, res) {
  try {
    const query = `
      SELECT l.post_id, l.user_id AS liker_id, p_t.type AS post_type, liker.first_name, liker.association_name, thumbnail_link AS notification_pic, n.notification_type, read, n.created_at
      FROM notifications AS n

      INNER JOIN likes_notifications AS l_n
      ON l_n.notification_id = n.notification_id

      INNER JOIN likes AS l
      ON l.like_id = l_n.like_id

      INNER JOIN users AS receiver
      ON receiver.user_id = l.user_id

      INNER JOIN users AS liker
      ON liker.user_id = l.user_id

      INNER JOIN posts AS p
      ON p.post_id = l.post_id

      INNER JOIN post_types AS p_t
      ON p_t.type_id = p.type_id

      WHERE n.receiver_id = $1
      ORDER BY n.created_at DESC
    `;
    const values = [userId];

    const { rows: likesNotifications } = await client.query(query, values);

    return likesNotifications;
  } catch (error) {
    await client.query("ROLLBACK");

    handleDbError(error, res);
  }
}

const concatNotificationsTypesAndReturnNeededOnes = (
  postsNotifications,
  messagesNotifications,
  likesNotifications,
  numOfGroupe,
  numOfElementsPerGroupe
) => {
  const firstElementIndex = numOfElementsPerGroupe * (numOfGroupe - 1);
  const lastElementIndex = firstElementIndex + numOfElementsPerGroupe;

  const notificationsNeeded = postsNotifications
    .concat(messagesNotifications)
    .concat(likesNotifications)
    .sort((a, b) => {
      if (a.created_at < b.created_at) {
        return 1;
      } else if (a.created_at > b.created_at) {
        return -1;
      } else {
        return 0;
      }
    })
    .slice(firstElementIndex, lastElementIndex);

  return notificationsNeeded;
};

module.exports = { getAuthUserNotifications };
