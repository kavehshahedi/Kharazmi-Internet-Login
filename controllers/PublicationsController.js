const moment = require('moment');
const mongoose = require('mongoose');

const Publication = require('../models/publications/Publications');
const User = require('../models/user/User');

const OutputCreator = require('../utils/OutputCreator');
const Variables = require('../utils/Variables');

module.exports.getPublication = async function (id) {
    return new Promise(resolve => {
        Publication.findById(String(id), (err, pub) => {
            if (err) resolve(-1);
            else {
                if (!pub) resolve(-2);
                else resolve(pub);
            }
        });
    });
}

module.exports.getPublicationsOfTheMonth = async function (limit) {
    const thisMonth = moment().endOf('day').add(-30, 'days').toDate();
    return await queryPublications({ is_potm: true, is_active: true, potm_date: { $gte: thisMonth } },
        limit, { released_at: -1 }, 'title number creators.university_name creators.association_name image_url _id');
}

module.exports.getLatestPublications = async function (limit) {
    return await queryPublications({ is_active: true },
        limit, { released_at: -1 }, 'title number creators.university_name creators.association_name image_url _id');
}

module.exports.getMostDownloadedPublications = async function (limit) {
    return await queryPublications({ is_active: true }, limit, { downloads_count: -1 },
        'title number creators.university_name creators.association_name image_url _id');
}

module.exports.getMostViewedPublications = async function (limit) {
    return await queryPublications({ is_active: true }, limit, { views_count: -1 },
        'title number creators.university_name creators.association_name image_url _id');
}

module.exports.searchPublications = async function (data) {
    const regex = new RegExp('.*' + data + '.*', 'i');
    return await queryPublications({
        is_active: true,
        $or: [
            {
                'title': {
                    $regex: regex
                }
            },
            {
                'creators.ceo': {
                    $regex: regex
                }
            },
            {
                'creators.cover_designer': {
                    $regex: regex
                }
            },
            {
                'creators.page_designer': {
                    $regex: regex
                }
            },
            {
                'creators.university_name': {
                    $regex: regex
                }
            },
            {
                'creators.association_name': {
                    $regex: regex
                }
            }
        ]
    }, 30, {}, 'title number creators.university_name creators.association_name image_url _id rate');
}

module.exports.setFavorite = async function (data) {
    return new Promise(callback => {
        const id = data.id;
        const phone = data.phone;
        User.findOne({ phone: phone }).exec(async (err, user) => {
            if (err || !user) callback(OutputCreator.createError('general_error', Variables.errors.generalError));
            else {
                let contains = false;
                user.favorite_publications.forEach(p => {
                    if (String(p._id).localeCompare(id) === 0) contains = true;
                });

                if (contains)
                    user.favorite_publications.splice(user.favorite_publications.indexOf(id), 1);
                else
                    user.favorite_publications.push(id);

                await user.save();

                let bookmarks = [];
                user.favorite_publications.forEach(f => {
                    if (f._id !== null || f._id !== undefined)
                        bookmarks.push(f._id);
                });

                callback(OutputCreator.createResult({ status: !contains, favorite_publications: bookmarks }));
            }
        });
    });
}

module.exports.getFavoritePublications = async function (data) {
    return new Promise(callback => {
        const phone = data.phone;
        User.findOne({ phone: phone }).exec((err, user) => {
            if (err || !user) callback(OutputCreator.createError('general_error', Variables.errors.generalError));
            else {
                if (user.favorite_publications == undefined || user.favorite_publications.length == 0)
                    callback(OutputCreator.createResult([]));
                else {
                    Publication.find().where('_id').in(user.favorite_publications)
                        .select('title number creators.university_name creators.association_name image_url _id rate')
                        .exec((err, pubs) => {
                            if (err) return;
                            else {
                                callback(OutputCreator.createResult(pubs));
                            }
                        });
                }
            }
        });
    });
}

async function queryPublications(options, limit = 200, sort = {}, selection = '-__v') {
    try {
        return await Publication.find(options).select(selection).limit(limit).sort(sort).maxTimeMS(1500).lean();
    } catch (err) { console.log(err); return [0] };
}