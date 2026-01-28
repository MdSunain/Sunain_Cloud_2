const File = require('../models/File');
const crypto = require('crypto');

exports.shareFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.id;

    const file = await File.findById(fileId);
    if (!file) return res.status(404).send("File not found");

    if (file.userId.toString() !== userId) {
      return res.status(403).send("Unauthorized");
    }

    // Generate token if not exists
    if (!file.shared) {
      file.shared = true;
      file.shareToken = crypto.randomBytes(24).toString('hex');
      await file.save();
    }

    const shareUrl = `${req.protocol}://${req.get('host')}/share/${file.shareToken}`;

    res.json({ shareUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to share file");
  }
};
