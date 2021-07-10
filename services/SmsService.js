const Ghasedak = require('ghasedak');
const smsAPI = new Ghasedak("4792de44af9cebd53b2b09a38eebad0caafa61bba3f369806f607391e6546f20");

module.exports.sendLoginCode = function (phone, code) {
    //smsAPI.verification({ param1: code,receptor: phone, template: 'publications', type: 1});
    console.log('Sms sent. code was: ' + code);
}