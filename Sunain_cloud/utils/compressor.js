const zlib = require('zlib');


exports.decompress = (buffer)=>{
  return zlib.gunzipSync(buffer);
}

exports.compress = (buffer)=>{
  return zlib.gzipSync(buffer);
}