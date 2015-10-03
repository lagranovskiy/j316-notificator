var requestify = require('requestify');
var config = require('./../config/config');

console.log('Scheduled driven notification call started');

requestify.get(config.hostname + 'notify', {
    params: {
        apiToken: config.apiToken
    }
}).then(function (response) {
    console.info('Notification result', response.body);
    console.log('Scheduled driven notification call processed');
});
