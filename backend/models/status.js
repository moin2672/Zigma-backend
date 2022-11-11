const mongoose = require('mongoose');

const statusSchema =  mongoose.Schema({
    status: {type:String, required: true},
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Status', statusSchema);