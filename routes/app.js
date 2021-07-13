const express = require('express');
const router = express.Router();

const AppController = require('../controllers/AppController');

const OutputCreator = require('../utils/OutputCreator');

router.post('/get-main-page', async (req, res) => {
    const pubs = await AppController.getMainPage({ retrieve_data_count: 5 });
    return res.json(OutputCreator.createResult(pubs));
});

router.post('/get-category', async (req, res) => {
    return res.json(OutputCreator.createResult(await AppController.getCategoryPublications(req.body.id)));
});

router.post('/get-publication', async (req, res) => {
    return res.json(await AppController.getPublication(req.body));
});

router.post('/search', async (req, res) => {
    return res.json(OutputCreator.createResult(await AppController.search(req.body.search_text)));
});

router.post('/set-favorite', async (req, res) => {
    return res.json(await AppController.setFavorite(req.body));
});

router.post('/get-favorites', async (req, res) => {
    return res.json(await AppController.getFavoritePublications(req.body));
});

module.exports = router;