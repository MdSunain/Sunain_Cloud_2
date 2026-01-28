const File = require('../models/File')
const Chunk = require('../models/Chunk')

const fs = require('fs');
const zlib = require('zlib');

exports.downloadFile = async (req,res)=>{
    try{
         const {fileId} = req.params;
         const userId = req.user.id;

        //  1.fetch file metadata
        const file = await File.findById(req.params.fileId)
        if(!file) return res.status(404).send("file not found")

        // 2.Authorization check
        if (file.userId.toString() !== userId) {
            return res.status(403).send("Unauthorized");
        }


        // 3.prepare response header
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${file.filename}"`
        )
        res.setHeader("Content-Type", "application/octet-stream")

        // 4. stream chunk in order
        for(const hash of file.chunks){
            const chunk = await Chunk.findOne({hash})
            
            if(!chunk) {
                console.error("Missing chunk hash:", hash);
                return res.status(500).send("Corrupted file (chunk missing)");
            }
            
            if (!fs.existsSync(chunk.path)) {
                console.error("Missing chunk file:", chunk.path);
                return res.status(500).send("Corrupted storage");
            }

        const compressedData = fs.readFileSync(chunk.path);
        const data = chunk.compressed?zlib.gunzipSync(compressedData): compressedData

        res.write(data);
    }
    res.end();
    }
    catch(err){
        console.error("Download failed:", err);
        res.status(500).send("Download failed");
    }
}