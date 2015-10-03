var config = {

    host: process.env.HOST || 'localhost',
    httpPort: process.env.PORT || 8484,
    env: process.env.NODE_ENV || 'dev',
    mongoDB: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/j316notificator',

    init: function () {
        return this;
    }


};

module.exports = config.init();