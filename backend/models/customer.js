const mongoose = require('mongoose');

const customerSchema =  mongoose.Schema({
    customerName: {type:String, required: true},
    customerPhoneNo: {type:String, required: true},
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Customer', customerSchema);