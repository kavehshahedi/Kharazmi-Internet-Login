const express = require('express');
const router = express.Router();

const JwtService = require('../services/JwtService');
const OutputCreator = require('../utils/OutputCreator');
const Variables = require('../utils/Variables');

router.use(async (req, res, next) => {
    //await new Promise(resolve => setTimeout(resolve, 1000));

    if (req.path.localeCompare('/auth/get-account') === 0) next();
    else {
        const canAccess = await JwtService.verifyToken(req.headers.token);
        if (canAccess) next();
        else return res.json(OutputCreator.createError('Not Authorized', Variables.errors.auth.notAuthorized));
    }
});

router.use('/auth', require('./auth'));
router.use('/app', require('./app'));
router.use('/profile', require('./profile'));

module.exports = router;