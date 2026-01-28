const File = require('../models/File');
const Chunk = require('../models/Chunk');
const fs = require('fs');
const zlib = require('zlib');
const mime = require('mime-types');

exports.viewFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) return res.status(404).send("File not found");

    if (file.userId.toString() !== req.user.id) {
      return res.status(403).send("Unauthorized");
    }

    const contentType =
      mime.lookup(file.filename) || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader(
      'Content-Disposition',
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
    res.status(500).send("View failed");
  }
};
