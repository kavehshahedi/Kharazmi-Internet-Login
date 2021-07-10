const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({
    phone: { type: String, index: { unique: true } },
    user_name: { type: String, default: 'کاربر نشریاب' },
    verified: { type: Boolean, default: false },
    created_at: { type: String },
    access_token: { type: String },
    favorite_publications: [{ publication_id: String }]
});

module.exports = mongoose.model('user', userSchema);