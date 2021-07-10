const User = require('../models/user/User');

const OutputCreator = require('../utils/OutputCreator');
const Variables = require('../utils/Variables');

module.exports.editName = function (data, callback) {
    const phone = data.phone;
    const name = data.name;

    if (name.length < 3) {
        callback(OutputCreator.createError('invalid_name', Variables.errors.profile.invalidName));
        return;
    }

    User.findOne({ phone: phone }).exec(async (err, user) => {
        if (err || !user) callback(OutputCreator.createError('general_error', Variables.errors.generalError));
        else {
            user.user_name = name;
            await user.save();

            callback(OutputCreator.createResult({ user_name: user.user_name }));
        }
    })
}