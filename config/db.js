// Do not expose your credentials in your code.
let atlasDB = "mongodb+srv://avalonstanley:xLOB2p75ZwfUM4we@cluster001.3oynn.mongodb.net/Inventory?retryWrites=true&w=majority";

// Database setup
let mongoose = require('mongoose');

module.exports = function(){

    mongoose.connect(atlasDB);
    let mongodb = mongoose.connection;

    mongodb.on('error', console.error.bind(console, 'Connection Error:'));
    mongodb.once('open', ()=>{
        console.log('===> Connected to MongoDB.');
    })

    return mongodb;
}