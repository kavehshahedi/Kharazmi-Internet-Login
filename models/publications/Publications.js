const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let publicationSchema = new Schema({
    title: { type: String },
    university_id: { type: String },
    association_id: { type: String },
    number: { type: Number },
    image_url: { type: String },
    description: { type: String },
    full_description: { type: String },
    download_url: { type: String },
    released_at: { type: Date },
    creators: {
        university_name: { type: String },
        association_name: { type: String },
        ceo: { type: String },
        cover_designer: { type: String },
        page_designer: { type: String }
    },
    is_active: { type: Boolean, default: true },
    is_premium: { type: Boolean, default: false },
    downloads_count: { type: Number, default: 0 },
    views_count: { type: Number, default: 0 },
    size: {type: Number, default: 0},
    rate: { type: Number, default: 0 },
    is_editor_choice: { type: Boolean, default: false },
    is_potm: { type: Boolean, default: false },
    potm_date: { type: Date, default: new Date(2021, 1, 1) },
    comments: [{
        name: String,
        message: String,
        rate: Number
    }]
});

module.exports = mongoose.model('publication', publicationSchema);