const db = require("../../db");
const { handleDbError } = require("../db/dbErrorHandler");

const getPostTitle = async (postId, client, res) => {
  try {
    const query = `
      SELECT title 
      FROM posts
      WHERE post_id = $1
    `;
    const values = [postId];

    const {
      rows: [result],
    } = await client.query(query, values);

    return result.title;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const getPostTypeId = async (postId, client, res) => {
  try {
    const query = `
      SELECT type_id
      FROM posts
      WHERE post_id = $1
    `;
    const values = [postId];

    const {
      rows: [result],
    } = await client.query(query, values);

    return result.type_id;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const getPostWilaya = async (postId, client, res) => {
  try {
    const query = `
      SELECT wilaya 
      FROM posts 
      WHERE post_id = $1
    `;
    const values = [postId];

    const {
      rows: [result],
    } = await client.query(query, values);

    return result.wilaya;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

const getPostPublisher = async (postId) => {
  try {
    const query = `
      SELECT user_id 
      FROM posts
      WHERE post_id = $1
    `;
    const values = [postId];

    const {
      rows: [result],
    } = await db.query(query, values);

    return result.user_id;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getPostTitle,
  getPostTypeId,
  getPostWilaya,
  getPostPublisher,
};
