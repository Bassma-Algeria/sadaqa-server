const db = require("../../db");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { getContact } = require("../../utils/messages/getContact");
const { getAuthUserId } = require("../../utils/users/getAuthUserId");

const getContactsList = async (req, res) => {
  const currentUserId = getAuthUserId(req.headers);
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    const chatParticipants = await getChatParticipants(
      currentUserId,
      client,
      res
    );

    if (!chatParticipants?.length) {
      // the user never send a message to anyone and no one contact him
      return res.status(404).json({ success: true, data: "No contacts found" });
    }

    const contactsIds = filterChatParticipants(chatParticipants, currentUserId);
    let contactsInformation = await getContactsInformation(
      contactsIds,
      currentUserId,
      client,
      res
    );
    contactsInformation =
      orderContactsInfoPerLatestMessage(contactsInformation);

    await client.query("COMMIT");

    return res.status(200).json({ success: true, data: contactsInformation });
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  } finally {
    client.release();
  }
};

const getChatParticipants = async (currentUserId, client, res) => {
  try {
    const query = `
      SELECT DISTINCT sender_id, receiver_id
      FROM messages
      WHERE sender_id = $1 OR receiver_id = $1
    `;
    const values = [currentUserId];

    const { rows: chatParticipants, rowCount } = await client.query(
      query,
      values
    );

    return chatParticipants;
  } catch (error) {
    await client.query("ROLLBACK");

    handleDbError(error, res);
  }
};

const filterChatParticipants = (ChatParticipants, currentUserId) => {
  let contactsIds = ChatParticipants.map((participants) => {
    const { sender_id: senderId, receiver_id: receiverId } = participants;
    if (receiverId === currentUserId) {
      return senderId;
    } else {
      return receiverId;
    }
  });

  // remove duplicates
  contactsIds = contactsIds.filter(
    (contactId, index) => contactsIds.indexOf(contactId) === index
  );

  return contactsIds;
};

const getContactsInformation = async (
  contactsIds,
  currentUserId,
  client,
  res
) => {
  try {
    const contacts = [];
    for (let i = 0; i < contactsIds?.length; i++) {
      const contact = await getContact(
        contactsIds[i],
        currentUserId,
        client,
        res
      );

      contacts.push(contact);
    }

    return contacts;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const orderContactsInfoPerLatestMessage = (contactsInfo) => {
  const contactsInfoSorted = contactsInfo.sort((a, b) => {
    if (a.latestMessage.created_at < b.latestMessage.created_at) {
      return 1;
    } else if (a.latestMessage.created_at > b.latestMessage.created_at) {
      return -1;
    }
    return 0;
  });

  return contactsInfoSorted;
};

const getContactToAddInContactsList = async (req, res) => {
  const currentUserId = getAuthUserId(req.headers);
  const { contactId } = req.params;

  const client = await db.getClient();
  try {
    await client.query("BEGIN");

    const contactInfo = await getContact(contactId, currentUserId, client, res);

    await client.query("COMMIT");

    return res.status(200).json({ success: true, data: contactInfo });
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  } finally {
    client.release();
  }
};
module.exports = { getContactsList, getContactToAddInContactsList };
