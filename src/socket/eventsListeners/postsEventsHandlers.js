const {
  createLikeNotification,
} = require("../../controllers/notifications/likePostNotifications");
const {
  createPostNotifications,
} = require("../../controllers/notifications/postNotifications");
const db = require("../../db");
const { getPostPublisher } = require("../../utils/posts/getPostProperties");
const {
  emitSocketEventToTargetUser,
} = require("../../utils/socket/usersHelpers");
const {
  NEW_LIKE_NOTIFICATION,
  NEW_POST_NOTIFICATION,
} = require("../eventsNames");

const newLikeNotification = async (socket, io, postId, likeId) => {
  if (likeId) {
    const notificationReceiverId = await getPostPublisher(postId);
    const notificationId = await createLikeNotification(
      socket.userId,
      notificationReceiverId,
      likeId
    );

    if (notificationId) {
      const likeNotification = await getLikeNotification(notificationId);
      emitSocketEventToTargetUser(
        io,
        socket,
        notificationReceiverId,
        NEW_LIKE_NOTIFICATION,
        likeNotification
      );
    }
  }
};

const newPostNotification = async (socket, io, postId) => {
  const { receiversIds } = await createPostNotifications(postId, socket.userId);

  for (const receiverId of receiversIds) {
    const postNotification = await getPostNotification(receiverId, postId);
    emitSocketEventToTargetUser(
      io,
      socket,
      receiverId,
      NEW_POST_NOTIFICATION,
      postNotification
    );
  }
};

async function getLikeNotification(notificationId) {
  try {
    const query = `
      SELECT n.notification_id, l.post_id, l.user_id AS liker_id, p_t.type AS post_type, liker.first_name, liker.association_name, thumbnail_link AS notification_pic, n.notification_type, read, n.created_at
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

      WHERE n.notification_id = $1
      ORDER BY n.created_at DESC
    `;
    const values = [notificationId];

    const {
      rows: [likeNotification],
    } = await db.query(query, values);

    return likeNotification;
  } catch (error) {
    console.log(error);
  }
}

const getPostNotification = async (userId, postId) => {
  try {
    const query = `
      SELECT n.notification_id, p.post_id, type AS post_type, thumbnail_link AS notification_pic, n.notification_type, n.read, n.created_at
      FROM notifications AS n

      INNER JOIN post_notifications AS p_n
      ON p_n.notification_id = n.notification_id

      INNER JOIN posts AS p
      ON p.post_id = p_n.post_id
      
      INNER JOIN post_types AS p_t
      ON p.type_id = p_t.type_id

      WHERE n.receiver_id = $1 AND p.post_id = $2
      ORDER BY n.created_at DESC
    `;
    const values = [userId, postId];

    const {
      rows: [postNotification],
    } = await db.query(query, values);

    return postNotification;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { newLikeNotification, newPostNotification };
