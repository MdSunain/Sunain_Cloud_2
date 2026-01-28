const File = require('../models/File');
const { chunkBuffer } = require('../services/chunk.service');
const { storeChunk } = require('../services/storage.service');

exports.uploadFile = async (req, res) => {
    try{

        if(!req.file){
            return res.redirect("/home?uploaded=error");
        }


        const { originalname, buffer, size } = req.file;
        const userId = req.user.id;
    
        const chunks = chunkBuffer(buffer);
        const chunkHashes = [];
    
        for (const chunk of chunks) {
            const hash = await storeChunk(chunk);
            chunkHashes.push(hash);
        }
    
    
        await File.create({
            userId,
            filename: originalname,
            size,
            chunks: chunkHashes
        });
        res.redirect("/home?uploaded=success");
    }
    catch(err){
        console.error(err);
        res.redirect("/home?uploaded=error");
    }
}