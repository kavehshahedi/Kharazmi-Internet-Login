module.exports.createError = function (error, message, full_error = '') {
    canShowFullError = true;
    if (canShowFullError) {
        var output = {
            status: 'NOK',
            error: error,
            message: message,
            full_error: full_error
        }

        return output;
    } else {
        var output = {
            status: 'NOK',
            error: error,
            message: message
        }

        return output;
    }
}

module.exports.createResult = function (data, message = '') {
    var output = {
        status: 'OK',
        message: message,
        data: data
    }

    return output;
}