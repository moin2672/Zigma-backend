const mongoose = require('mongoose');

const modelSchema =  mongoose.Schema({
    modelNo:{type:String, required: true},
    modelName: {type:String},
    modelDescription: {type:String},
    isAvailable:{type:Boolean},
    links: [String],
    lastUpdatedDate:{type:String, required: true},
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Model', modelSchema);