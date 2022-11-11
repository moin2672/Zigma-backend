const mongoose = require('mongoose');

const typeSchema =  mongoose.Schema({
    type: {type:String, required: true},
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Type', typeSchema);