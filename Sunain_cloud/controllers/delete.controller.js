const File = require('../models/File');
const Chunk = require('../models/Chunk');
const fs = require('fs');

exports.deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.id;

    // 1. Find file
    const file = await File.findById(fileId);
    if (!file) return res.status(404).send("File not found");

    // 2. Auth check
    if (file.userId.toString() !== userId) {
      return res.status(403).send("Unauthorized");
    }

    // 3. Process chunks
    for (const hash of file.chunks) {
      const chunk = await Chunk.findOne({ hash });
      if (!chunk) continue;

      chunk.refCount -= 1;

      if (chunk.refCount <= 0) {
        // Delete chunk file from disk
        if (fs.existsSync(chunk.path)) {
          fs.unlinkSync(chunk.path);
        }
        await Chunk.deleteOne({ hash });
      } else {
        await chunk.save();
      }
    }

    // 4. Delete file metadata
    await File.deleteOne({ _id: fileId });

    res.redirect('/home?deleted=success');
  } catch (err) {
    console.error("Delete failed:", err);
    res.redirect('/home?deleted=error');
  }
};
