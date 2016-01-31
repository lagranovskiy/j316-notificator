var postofficeController = require('./controller/PostofficeController');
var infoController = require('./controller/InfoController');
var config = require('../config/config');

module.exports = function (app) {


    var errorHandler = function (err, req, res, next) {
        console.error(err.stack);

        res.status(500).json({
            text: 'Internal error',
            error: err
        });
    };
    app.use(errorHandler);


    app.all('*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        res.header("Access-Control-Allow-Credentials", true);
        next();
    });

    app.get('/alive', isAlive);

    app.get('/notification', postofficeController.readNotifications);
    app.get('/notification/reference/:referenceId', postofficeController.readNotifications);
    app.get('/notification/category/:category', postofficeController.readNotifications);
    app.get('/notification/mobile/:mobile', postofficeController.readNotifications);
    app.get('/notification/email/:email', postofficeController.readNotifications);


    app.get('/next', infoController.getNextNotifications);
    app.get('/next/reference/:referenceId', infoController.getNextNotifications);
    app.get('/next/category/:category', infoController.getNextNotifications);
    app.get('/next/mobile/:mobile', infoController.getNextNotifications);
    app.get('/next/email/:email', infoController.getNextNotifications);

    app.get('/report', authorize, infoController.report);
    app.get('/notify', authorize, postofficeController.notify);
    app.get('/confirm/sms77', infoController.processSMS77Confirmation);

    app.post('/notification', authorize, postofficeController.scheduleNotification);

    app.delete('/notification', authorize, postofficeController.removeNotifications);
    app.delete('/notification/reference/:referenceId', authorize, postofficeController.removeNotifications);
    app.delete('/notification/category/:category', authorize, postofficeController.removeNotifications);
    app.delete('/notification/mobile/:mobile', authorize, postofficeController.removeNotifications);
    app.delete('/notification/email/:email', authorize, postofficeController.removeNotifications);


    /**
     * Test if the caller gave the apiToken in the apiToken query param.
     *
     * @param req
     * @param res
     * @param next
     */
    function authorize(req, res, next) {

        if (!req.query.apiToken) {
            res.sendStatus(401);
            return next('No API_TOKEN sent. Cannot process');
        }
        if (req.query.apiToken !== config.apiToken) {
            res.sendStatus(401);
            return next('Token API_TOKEN is invalid. Cannot process');
        }

        next();
    }

    /**
     * Evaluates if application is alive
     *
     * @param req
     * @param res
     * @param next
     */
    function isAlive(req, res, next) {
        res.send({timestamp: new Date()});
    }

};