const mongoose = require('mongoose');

const connectedUser = async ()=>{
    
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/Sunain_Cloud')
        console.log('MongoDB Connected')
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }

}


module.exports = connectedUser;