const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userVerifySchema = new Schema({
    phone: { type: String, index: { unique: true } },
    code: { type: String },
    created_at: { type: String },
    available_until: { type: String }
});

module.exports = mongoose.model('user_verify', userVerifySchema);