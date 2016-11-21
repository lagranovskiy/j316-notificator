var config = {
    hostname: process.env.HOSTNAME || 'http://localhost:8484/', // for requests
    host: process.env.HOST || 'localhost',
    httpPort: process.env.PORT || 8484,
    env: process.env.NODE_ENV || 'dev',
    apiToken: process.env.API_TOKEN || 'local123',
    mongoDB: process.env.MONGOLAB_URI || 'mongodb://heroku_x73vt8br:ha7mpcamould7ov910p8c6h75d@ds013545.mlab.com:13545/heroku_x73vt8br',

    notificationAPI: {
        google: {
            calAPI: process.env.GOOGLE_CAL_API || 'https://script.google.com/macros/s/AKfycby2iyq6v2_ztFPOf2tzoHjWPTlKDASGNd_kuWYN3FJOYDg4WyvT/exec'
        },
        postmark: {
            apiToken: process.env.POSTMARK_API_TOKEN || '327af72a-ad49-40ab-8c59-0421bbc8e307',
            inboundAddress: process.env.POSTMARK_INBOUND_ADDRESS || 'fff5169bbe1fa1d5d9e9702c83084d99@inbound.postmarkapp.com',
            senderEmail: process.env.POSTMARK_SENDER || 'gemeinde@agranovskiy.de'
        },
        sms77: {
            endpoint: process.env.SMS77_ENDPOINT || 'https://gateway.sms77.de',
            username: process.env.SMS77_USERNAME || 'lagranovskiy',
            apiToken: process.env.SMS77_APITOKEN || 'p90PlqrpoDNqu45I4Y4Vw38Fet7x9Bvb',
            smsType: process.env.SMS77_SMS_TYPE || 'basicplus', // cheapest
            senderSMS: process.env.SMS77_SENDER || 'Gemeinde', // ignored by cheapest
            debugMode: process.env.SMS77_DEBUG || '1' // ignored by cheapest
        }
    },
    report: {
        sendMails: process.env.REPORT_SEND || 'true',
        reportRecipient: process.env.REPORT_RECIPIENT || 'info@agranovskiy.de',
        reportDays: process.env.REPORT_DAYS || '1'
    },
    init: function () {
        return this;
    }


};

module.exports = config.init();