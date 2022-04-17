const { drive } = require("./getDriveAndGmail");
const fs = require("fs");

const uploadImageAndShareIt = async (image, idOfFileToUploadedIn) => {
  const imageId = await uploadImg(image, idOfFileToUploadedIn);
  await shareImageWithEveryone(imageId);
  removeImageFromLocal(image);
  return imageId;
};

async function uploadImg(image, idOfFileToUploadedIn) {
  const imageExtenstion =
    image.originalname.split(".")[image.originalname.split(".").length - 1];

  try {
    var fileMetadata = {
      name:
        Math.floor(Math.random() * 1000000000000000) + "." + imageExtenstion,
      parents: [idOfFileToUploadedIn],
    };
    var media = {
      mimeType: image.mimeType,
      body: fs.createReadStream(image.path),
    };
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
    });

    return response.data.id;
  } catch (error) {
    console.log(error);
  }
}

async function shareImageWithEveryone(imageId) {
  try {
    await drive.permissions.create({
      fileId: imageId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
  } catch (error) {
    console.log(error);
  }
}

async function removeImageFromLocal(image) {
  fs.unlinkSync(image.path);
}

const deleteImgFromDrive = async (imageId) => {
  try {
    await drive.files.delete({
      fileId: imageId,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  uploadImageAndShareIt,
  deleteImgFromDrive,
  removeImageFromLocal,
};
