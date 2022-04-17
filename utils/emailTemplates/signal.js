const getSignalHtmlEmailTemplate = (signalText, signalItemLink) => {
  return `
    <div style="font-family: sans-serif; padding: 10px;">
      <h1 style="margin-bottom: 20px;">Some one just send a new signal report :</h1>
      <div>
        <h3 style="font-size: 18px;">The reported item Link : </h3>
        <a>${signalItemLink}</a>
      </div>
      <div>
        <h3 style="font-size: 18px;">The report : </h3>
        <p>${signalText}</p>
      </div>
    </div>
  `;
};

module.exports = { getSignalHtmlEmailTemplate };
