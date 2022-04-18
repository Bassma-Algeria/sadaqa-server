const db = require("../../db/index");
const { handleDbError } = require("../../utils/db/dbErrorHandler");
const {
  deleteImgFromDrive,
} = require("../../utils/driveAndGmail/driveFunctions");

const activeAssociation = async (req, res) => {
  try {
    let { associationId, adminKey, imagesIds } = req.body;
    if (adminKey !== "18112002") {
      return res.status(401).json({ success: false, error: "Not Authorize !" });
    }
    imagesIds = imagesIds.split(",");

    const query = `
      UPDATE users
      SET active = true
      WHERE user_id = $1
    `;
    const values = [associationId];
    await db.query(query, values);

    imagesIds.map((imageId) => {
      deleteImgFromDrive(imageId);
    });
    return res.status(200).json({
      success: true,
      data: `association with id ${associationId} set active successfully.`,
    });
  } catch (error) {
    handleDbError(error, res);
  }
};

module.exports = { activeAssociation };
