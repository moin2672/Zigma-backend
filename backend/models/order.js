const mongoose = require('mongoose');

const orderSchema =  mongoose.Schema({
    customerPhoneNo:{type:String},
    orderBillNo: {type:String},
    orderType: {type:String},
    orderModelNo:{type:String},
    orderDescription: {type:String},
    totalAmount:{type:Number},
    amountPaid:{type:Number},
    amountPaidToday:{type:Number},
    transactionType:{type:String},
    transactionSummary:{type:String},
    orderStatus:{type:String},
    image:{type:String},
    lastUpdatedDate:{type:Date, required: true},
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Order', orderSchema);