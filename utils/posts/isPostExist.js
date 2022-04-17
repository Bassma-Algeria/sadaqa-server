const isPostExist = async (postId, client, res) => {
  try {
    const query = `
        SELECT user_id 
        FROM posts
        WHERE post_id = $1
      `;
    const values = [postId];

    const { rowCount } = await client.query(query, values);

    if (rowCount === 0) {
      return res.status(404).json({ success: false, error: "Post not found!" });
    }

    return;
  } catch (error) {
    await client.query("ROLLBACK");
    handleDbError(error, res);
  }
};

module.exports = { isPostExist };
