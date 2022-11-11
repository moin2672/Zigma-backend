const mongoose = require('mongoose');

const organizationSchema =  mongoose.Schema({
    organizationName: {type:String, required: true},
    organizationPhoneNo: {type:String, required: true},
    organizationWhatsAppNo: {type:String, required: true},
    organizationAddress: {type:String, required: true},
    organizationEmail: {type:String, required: true},
    organizationDescription: {type:String, required: true},
    organizationGoogleMap: {type:String, required: true},
    lastUpdatedDate: {type:Date, required: true},
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Organization', organizationSchema);