const moment = require('moment');
const crypto = require('crypto');

const User = require('../models/user/User');
const UserVerify = require('../models/user/UserVerify');

const SmsService = require('../services/SmsService');
const JwtService = require('../services/JwtService');
const OutputCreator = require('../utils/OutputCreator');
const Variables = require('../utils/Variables');

module.exports.requestLogin = function (data, callback) {
    const phone = data.phone;
    const code = generateVerificationCode();
    const createdAt = moment().format('YYYY-MM-DD HH-mm-ss');
    const availableUntil = moment().add(5, 'minutes').format('YYYY-MM-DD HH-mm-ss');

    UserVerify.findOne({ phone: phone }).exec(async (err, verify) => {
        if (err) callback(OutputCreator.createError('General error', Variables.errors.generalError));
        else {
            if (!verify) {
                verify = new UserVerify({
                    phone: phone,
                    code: code,
                    created_at: createdAt,
                    available_until: availableUntil
                });

                await verify.save();

                SmsService.sendLoginCode(phone, code);

                callback(OutputCreator.createResult({}));
            } else {
                if (moment().isBefore(moment(verify.available_until, 'YYYY-MM-DD HH-mm-ss'))) {
                    SmsService.sendLoginCode(phone, code);

                    callback(OutputCreator.createResult({}));
                } else {
                    verify.code = code;
                    verify.available_until = availableUntil;

                    await verify.save();

                    SmsService.sendLoginCode(phone, code);

                    callback(OutputCreator.createResult({}));
                }
            }
        }
    });
}

module.exports.reRequestVerifyCode = function (data, callback) {
    const phone = data.phone;

    UserVerify.findOne({ phone: phone }).exec(async (err, verify) => {
        if (err) callback(OutputCreator.createError('General error', Variables.errors.generalError));
        else {
            if (!verify) {
                const createdAt = moment().format('YYYY-MM-DD HH-mm-ss');
                const availableUntil = moment().add(5, 'minutes').format('YYYY-MM-DD HH-mm-ss');
                const code = generateVerificationCode();

                verify = new UserVerify({
                    phone: phone,
                    code: code,
                    created_at: createdAt,
                    available_until: availableUntil
                });
                await verify.save();

                SmsService.sendLoginCode(phone, code);
                callback(OutputCreator.createResult({}));
            } else {
                if (Math.abs(moment().diff(moment(verify.created_at, 'YYYY-MM-DD HH-mm-ss'), 'minutes')) < 1)
                    callback(OutputCreator.createError('Less than re-request time', Variables.errors.auth.lessThanReRequestTime));
                else {
                    if (moment().isBefore(moment(verify.available_until, 'YYYY-MM-DD HH-mm-ss'))) {
                        SmsService.sendLoginCode(phone, verify.code);
                        callback(OutputCreator.createResult({}));
                    } else {
                        const availableUntil = moment().add(5, 'minutes').format('YYYY-MM-DD HH-mm-ss');
                        const code = generateVerificationCode();

                        verify.available_until = availableUntil;
                        verify.code = code;
                        await verify.save();

                        SmsService.sendLoginCode(phone, code);
                        callback(OutputCreator.createResult({}));
                    }
                }
            }
        }
    });
}

module.exports.verifyLoginCode = function (data, callback) {
    const phone = data.phone;
    const code = data.code;

    UserVerify.findOne({ phone: phone, code: code }).exec((err, verify) => {
        if (err) callback(OutputCreator.createError('General error', Variables.errors.generalError));
        else {
            if (!verify) callback(OutputCreator.createError('Wrong verify', Variables.errors.auth.noVerifyObject));
            else {
                User.findOne({ phone: phone }).exec(async (err, user) => {
                    if (err) callback(OutputCreator.createError('General error', Variables.errors.generalError));
                    else {
                        const accessToken = await generateAccessToken();
                        if (!user) {
                            user = new User({
                                phone: phone,
                                created_at: moment().format('YYYY-MM-DD HH-mm-ss'),
                                verified: true,
                                access_token: accessToken
                            });

                            await user.save();

                            callback(OutputCreator.createResult({
                                phone: phone,
                                user_name: userName,
                                access_token: accessToken,
                                jwt: JwtService.signToken({ phone: '-1' })
                            }));
                        } else {
                            if (user.verified == false)
                                user.verified = true;

                            user.access_token = accessToken;
                            await user.save();

                            callback(OutputCreator.createResult({
                                phone: phone,
                                user_name: user.user_name,
                                access_token: accessToken,
                                jwt: JwtService.signToken({ phone: '-1' })
                            }));
                        }
                    }
                });
            }
        }
    });
}

module.exports.getAccount = async function (data, callback) {
    const phone = data.phone;
    const accessToken = data.access_token;

    if (accessToken == undefined) { callback(OutputCreator.createError('General error', Variables.errors.generalError)); return; }
    if (phone == undefined) { callback(OutputCreator.createError('General error', Variables.errors.generalError)); return; }

    if (phone.localeCompare('-1') === 0) {
        callback(OutputCreator.createResult({
            phone: '-1',
            user_name: Variables.defaultUserName,
            access_token: await generateAccessToken(),
            jwt: JwtService.signToken({ phone: '-1' }),
            favorite_publications: []
        }));
    } else {
        User.findOne({ phone: phone }).exec(async (err, user) => {
            if (err) callback(OutputCreator.createError('General error', Variables.errors.generalError));
            else {
                if (!user) callback(OutputCreator.createError('User not found', Variables.errors.auth.userNotFound));
                else {
                    if (user.verified == false) callback(OutputCreator.createError('Not verified', Variables.errors.auth.notVerified));
                    else {
                        /*if (accessToken.localeCompare(user.access_token) !== 0)
                            callback(OutputCreator.createError('Invalid access token', Variables.errors.auth.InvalidAccessToken));
                        else {
                            user.access_token = await generateAccessToken();
                        await user.save();

                        callback(OutputCreator.createResult({
                            phone: phone,
                            user_name: user.user_name,
                            access_token: user.access_token,
                            jwt: JwtService.signToken({ phone: phone }),
                            favorite_publications: user.favorite_publications
                        }));
                        }*/

                        let bookmarks = [];
                        user.favorite_publications.forEach(f => {
                            if (f._id !== null || f._id !== undefined)
                                bookmarks.push(f._id);
                        });

                        callback(OutputCreator.createResult({
                            phone: phone,
                            user_name: user.user_name,
                            access_token: user.access_token,
                            jwt: JwtService.signToken({ phone: phone }),
                            favorite_publications: bookmarks
                        }));
                    }
                }
            }
        });
    }
}

function generateVerificationCode() {
    return Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
}

async function generateAccessToken() {
    return new Promise(resolve => {
        crypto.randomBytes(24, (err, buffer) => {
            resolve(buffer.toString('hex'));
        });
    });
}