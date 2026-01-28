exports.chunkBuffer = (buffer, chunkSize = 256 * 1024) => {
    const chunks = [];
    for (let i = 0; i < buffer.length; i += chunkSize) { // Create chunks of specified size
        chunks.push(buffer.slice(i, i + chunkSize));
    }
    return chunks; // Return array of buffer chunks
}