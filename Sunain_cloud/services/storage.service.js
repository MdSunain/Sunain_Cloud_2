const { createHash } = require('crypto');
const fs = require('fs');
const path = require('path');
const Chunk = require('../models/Chunk');
const { compress } = require('../utils/compressor');

// Deduplication based storage service

const STORAGE_PATH = path.join(__dirname, '..', 'storage', 'chunks');// Ensure this directory exists

exports.storeChunk = async (buffer)=>{ // buffer is a Buffer object representing the chunk data

    const hash = createHash('sha256').update(buffer).digest('hex');
    
    let chunk = await Chunk.findOne({hash});
    
    if(chunk){// Chunk already exists
        chunk.refCount += 1; 
        await chunk.save();
        return chunk.hash;
    }
    
    const compressedFile = compress(buffer);// Compress the chunk data
    const sharepath = path.join(STORAGE_PATH,hash.slice(0,2), hash.slice(2,4))// Create subdirectories based on hash
    
    fs.mkdirSync(sharepath, { recursive: true})// Ensure directory exists
    
    const filePath = path.join(sharepath, `${hash}.chunk`) 
    
    fs.writeFileSync(filePath, compressedFile); // Save compressed chunk to disk
    
    
    await Chunk.create({// New chunk entry in DB
        hash,
        size: buffer.length,
        refCount: 1,
        path: filePath,
        compressed: true
    })
    
    return hash; // Return chunk hash
}
