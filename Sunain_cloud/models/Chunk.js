const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({

    hash:{
        type: String, 
        unique: true,
        index: true
    },
    size: Number,
    path: String,
    refCount:{
        type: Number,
        default: 1
    },
    compressed: Boolean
})

module.exports = mongoose.model('Chunk', chunkSchema)
