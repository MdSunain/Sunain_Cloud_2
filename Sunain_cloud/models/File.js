const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    userId: String,
    filename: String,
    size: Number,
    createdAt:{
        type:Date,
        default: Date.now,
    },
    chunks: [String],

    shared: {
    type: Boolean,
    default: false
  },
  shareToken: {
    type: String,
    index: true
  }

})

module.exports = mongoose.model('File', fileSchema)

