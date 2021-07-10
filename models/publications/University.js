const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let universitySchema = new Schema({
    name: { type: String },
    city: { type: String },
    type: {
        id: { type: String },
        name: { type: String }
    },
    logo_image_url: { type: String, default: '' },
    description: { type: String, default: ''},
    website_url: { type: String },
    is_uotm: { type: Boolean, default: false },
    uotm_date: { type: Date, default: new Date(2021, 1, 1) },
    is_active: { type: Boolean, default: true }
});

module.exports = mongoose.model('university', universitySchema);