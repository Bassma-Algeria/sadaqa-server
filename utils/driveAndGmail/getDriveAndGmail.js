const { google } = require("googleapis");
require("dotenv").config();

const getOAuth2Client = () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECTED_URL
  );

  oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return oAuth2Client;
};

const auth = getOAuth2Client();
const drive = google.drive({ version: "v3", auth });
const gmail = google.gmail({ version: "v1", auth });

module.exports = { drive, gmail };
