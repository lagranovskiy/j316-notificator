var config = {

    host: process.env.HOST || 'localhost',
    httpPort: process.env.PORT || 8484,
    env: process.env.NODE_ENV || 'dev',
    mongoDB: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/j316notificator',

    notificationAPI: {
        postmark: {
            apiKey: process.env.POSTMARK_API_KEY || '327af72a-ad49-40ab-8c59-0421bbc8e307',
            apiToken: process.env.POSTMARK_API_TOKEN || '327af72a-ad49-40ab-8c59-0421bbc8e307',
            inboundAddress: process.env.POSTMARK_INBOUND_ADDRESS || 'fff5169bbe1fa1d5d9e9702c83084d99@inbound.postmarkapp.com',
            smtpServer: process.env.POSTMARK_SMTP_SERVER || 'smtp.postmarkapp.com',
            senderEmail: process.env.POSTMARK_SENDER || 'gemeinde@agranovskiy.de'
        }
    },

    init: function () {
        return this;
    }


};

module.exports = config.init();