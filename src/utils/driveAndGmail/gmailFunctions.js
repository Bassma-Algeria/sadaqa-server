const { gmail } = require("./getDriveAndGmail");

const EMAIL_TO_SEND_TO = "yasser.belatreche0@gmail.com";
const SADAQA_EMAIL = "sadaqacontact@gmail.com";

const sendEmail = async (htmlEmailTemplate, emailTitle) => {
  try {
    const message = createEmailMessage(
      EMAIL_TO_SEND_TO,
      SADAQA_EMAIL,
      emailTitle,
      htmlEmailTemplate
    );

    await gmail.users.messages.send({
      userId: "me",
      resource: {
        raw: message,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const createEmailMessage = (to, from, subject, message) => {
  const str = [
    'Content-Type: text/html; charset="UTF-8"\n',
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    "to: ",
    to,
    "\n",
    "from: ",
    from,
    "\n",
    "subject: ",
    subject,
    "\n\n",
    message,
  ].join("");

  const encodedMail = new Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return encodedMail;
};

module.exports = { sendEmail };
