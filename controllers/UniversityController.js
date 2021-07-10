const moment = require('moment');

const University = require('../models/publications/University');

module.exports.getUniversitiesOfTheMonth = async function (limit) {
    const thisMonth = moment().endOf('day').add(-30, 'days').toDate();
    const unis = await queryUniversities({ is_active: true, is_uotm: true, uotm_date: { $gte: thisMonth } }, limit);
    return unis;
}

module.exports.searchUniversities = async function (data) {
    const regex = new RegExp('.*' + data + '.*', 'i');
    return await queryUniversities({
        is_active: true,
        $or: {
            name: {
                $regex: regex
            },
            city: {
                $regex: regex
            }
        }
    });
}

async function queryUniversities(options, limit = 200, sort = {}) {
    try {
        return await University.find(options).select('-__v').limit(limit).sort(sort).maxTimeMS(1500).lean();
    } catch (err) {
        return [];
    }
}