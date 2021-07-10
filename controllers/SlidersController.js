const Slider = require('../models/app/Slider');

module.exports.getSlidersByCategory = async function (category, limit = 5) {
    try{
        return await Slider.find({ is_active: true, category: category }).select('-_id -v').limit(limit).maxTimeMS(1500).lean();
    }catch(err) {
        return [];
    }
}