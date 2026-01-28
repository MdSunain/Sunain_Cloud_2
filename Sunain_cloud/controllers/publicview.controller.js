const File = require('../models/File');
const Chunk = require('../models/Chunk');
const fs = require('fs');
const zlib = require('zlib');
const mime = require('mime-types');

exports.viewSharedFile = async (req, res) => {
  try {
    const { token } = req.params;

    const file = await File.findOne({ shareToken: token, shared: true });
    if (!file) return res.status(404).send("Invalid link");

    const contentType = mime.lookup(file.filename) || 'application/octet-stream';

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.filename}"`
    );

    for (const hash of file.chunks) {
      const chunk = await Chunk.findOne({ hash });
      if (!chunk || !fs.existsSync(chunk.path)) {
        return res.status(500).send("Corrupted file");
      }

      const compressed = fs.readFileSync(chunk.path);
      const data = chunk.compressed
        ? zlib.gunzipSync(compressed)
        : compressed;

      res.write(data);
    }

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to view shared file");
  }
};
