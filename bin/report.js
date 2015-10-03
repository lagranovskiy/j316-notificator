var requestify = require('requestify');
var config = require('./../config/config');

console.log('Scheduled driven Report call started');

requestify.get(config.hostname + 'report', {
    params: {
        apiToken : config.apiToken
    }
}).then(function (response) {
    console.info('Report result', response.body);
    console.log('Scheduled driven Report call processed');
});


