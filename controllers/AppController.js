const SlidersController = require('./SlidersController');
const PublicationsController = require('./PublicationsController');
const UniversitiesController = require('./UniversityController');

const OutputCreator = require('../utils/OutputCreator');
const Variables = require('../utils/Variables');

module.exports.getMainPage = async function (data) {
    const retrieveDataLimit = data.retrieve_data_count;

    const sliders = await SlidersController.getSlidersByCategory('main-page', retrieveDataLimit);
    const POTM = await PublicationsController.getPublicationsOfTheMonth(retrieveDataLimit);
    const LP = await PublicationsController.getLatestPublications(retrieveDataLimit);
    //const UOTM = await UniversitiesController.getUniversitiesOfTheMonth(retrieveDataLimit);
    const MDP = await PublicationsController.getMostDownloadedPublications(retrieveDataLimit);
    const MVP = await PublicationsController.getMostViewedPublications(retrieveDataLimit);

    return {
        sliders: sliders,
        categories: [
            {
                category_id: 'publications_of_the_month',
                category_name: 'نشریات برتر ماه',
                data: POTM
            },
            {
                category_id: 'latest_publications',
                category_name: 'آخرین نشریات',
                data: LP
            },
            /*{
                category_id: 'universities_of_the_month',
                category_name: 'دانشگاه‌های برتر ماه',
                data: UOTM
            },*/
            {
                category_id: 'most_downloaded_publications',
                category_name: 'پر دانلودترین نشریات',
                data: MDP
            },
            {
                category_id: 'most_viewed_publications',
                category_name: 'پر بازدیدترین نشریات',
                data: MVP
            }
        ]
    }
}

module.exports.getPublication = async function (data) {
    const result = await PublicationsController.getPublication(data.id);
    if (result == -1) return OutputCreator.createError('General error', Variables.errors.generalError);
    else if (result == -2) return OutputCreator.createError('Publication not found', Variables.errors.app.publicationNotFound);
    else return OutputCreator.createResult(result);
}

module.exports.search = async function (data) {
    return await PublicationsController.searchPublications(data);
}

module.exports.setFavorite = async function (data) {
    return await PublicationsController.setFavorite(data);
}

module.exports.getFavoritePublications = async function (data) {
    return await PublicationsController.getFavoritePublications(data);
}

module.exports.getCategoryPublications = async function (category) {
    let data = [];
    let categoryName = '';

    switch (category) {
        case 'publications_of_the_month':
            data = await PublicationsController.getPublicationsOfTheMonth(100);
            categoryName = 'نشریات برتر ماه';
            break;
        case 'latest_publications':
            data = await PublicationsController.getLatestPublications(100);
            categoryName = 'آخرین نشریات';
            break;
        case 'most_downloaded_publications':
            data = await PublicationsController.getMostDownloadedPublications(100);
            categoryName = 'پر دانلودترین نشریات';
            break;
        case 'most_viewed_publications':
            data = await PublicationsController.getMostViewedPublications(100);
            categoryName = 'پر بازدیدترین نشریات';
            break;
    }

    return { category_name: categoryName, data: data };
}