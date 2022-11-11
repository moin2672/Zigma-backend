const mongoose = require('mongoose');

const gdriveSchema =  mongoose.Schema({
    client_id: {type:String, required: true},
    client_secret: {type:String, required: true},
    redirect_url: {type:String, required: true},
    refresh_token: {type:String, required: true},
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Gdrive', gdriveSchema);