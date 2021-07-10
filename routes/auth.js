const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');

router.post('/get-account', (req, res) => {
    AuthController.getAccount(req.body, result => res.json(result));
});

router.post('/request-login', (req, res) => {
    AuthController.requestLogin(req.body, result => res.json(result));
});

router.post('/verify-login', (req, res) => {
    AuthController.verifyLoginCode(req.body, result => res.json(result));
});

module.exports = router;