const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let sliderSchema = new Schema({
    title: { type: String },
    image_url: { type: String },
    index: { type: Number },
    ref_url: { type: String },
    category: { type: String },
    is_active: { type: Boolean, default: true }
});

module.exports = mongoose.model('slider', sliderSchema);