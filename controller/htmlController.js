const path = require('path');
exports.htmlFileSend = (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
};
