const { handleDbError } = require("../../utils/db/dbErrorHandler");
const { sendEmail } = require("../../utils/driveAndGmail/gmailFunctions");
const {
  getSignalHtmlEmailTemplate,
} = require("../../utils/emailTemplates/signal");

const signal = async (req, res) => {
  const { signalText, signalItemLink } = req.body;

  try {
    const htmlEmailTemplate = getSignalHtmlEmailTemplate(
      signalText,
      signalItemLink
    );
    const emailTitle = "Someone send a report from sadaqa";

    await sendEmail(htmlEmailTemplate, emailTitle);

    return res
      .status(200)
      .json({ success: true, message: "signal email sent successfully" });
  } catch (error) {
    handleDbError(error, res);
  }
};

module.exports = { signal };
