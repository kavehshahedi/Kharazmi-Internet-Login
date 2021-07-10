const express = require('express');
const router = express.Router();

const ProfileController = require('../controllers/ProfileController');

router.post('/edit-name', (req, res) => {
    ProfileController.editName(req.body, result => res.json(result));
});

module.exports = router;