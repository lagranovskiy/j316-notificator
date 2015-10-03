var postofficeController = require('./controller/PostofficeController');
var infoController = require('./controller/InfoController');

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

    app.get('/notification', postofficeController.readNotifications);
    app.get('/notification/reference/:referenceId', postofficeController.readNotifications);
    app.get('/notification/category/:category', postofficeController.readNotifications);
    app.get('/notification/mobile/:mobile', postofficeController.readNotifications);
    app.get('/notification/email/:email', postofficeController.readNotifications);


    app.post('/notification', postofficeController.scheduleNotification);
    app.get('/notify', postofficeController.notify);

    app.delete('/notification', postofficeController.removeNotifications);
    app.delete('/notification/reference/:referenceId', postofficeController.removeNotifications);
    app.delete('/notification/category/:category', postofficeController.removeNotifications);
    app.delete('/notification/mobile/:mobile', postofficeController.removeNotifications);
    app.delete('/notification/email/:email', postofficeController.removeNotifications);

    app.get('/next', infoController.getNextNotifications);
    app.get('/next/reference/:referenceId', infoController.getNextNotifications);
    app.get('/next/category/:category', infoController.getNextNotifications);
    app.get('/next/mobile/:mobile', infoController.getNextNotifications);
    app.get('/next/email/:email', infoController.getNextNotifications);

};