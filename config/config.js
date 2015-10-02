var config = {

    host: process.env.HOST || 'localhost',
    httpPort: process.env.PORT || 8484,
    env: process.env.NODE_ENV || 'dev',
    mongoDB: process.env.MONGOLAB_URI || 'mongodb://heroku_0jlkr6pr:q4agk1edvvu7lc0hcf18je8oo0@ds027744.mongolab.com:27744/heroku_0jlkr6pr',

    init: function () {
        return this;
    }


};

module.exports = config.init();