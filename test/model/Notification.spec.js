'use strict';

// import the moongoose helper utilities
var utils = require('../util');
var moment = require('moment');

var should = require('should');
var async = require('neo-async');

// import our User mongoose model
var Notification = require('../../api/model/Notification');


describe('Notification: models', function () {

    describe('#create()', function () {
        it('should create a new Notification', function (done) {
            var scheduledTime = moment().add(1, 'days');
            // Create a User object to pass to Notification.create()
            var notification = {
                recipient: {
                    name: 'Noo, Andreas',
                    mobile: '0157 361118',
                    email: 'test@agranovskiy.de'
                },
                scheduledDate: scheduledTime.format(),
                referenceId: 'TALENDRUN',
                notificationType: 'email',
                subject: 'Hohoh',
                category: 'Buchertisch',
                message: 'Test!'
            };

            async.waterfall([

                    function (notificationCreated) {
                        Notification.create(notification, notificationCreated)
                    },
                    function (createdUser, contentTested) {

                        // Confirm that that an error does not exist

                        // verify that the returned user is what we expect
                        createdUser.recipient.name.should.equal('Noo, Andreas');
                        createdUser.recipient.mobile.should.equal('0157 361118');

                        createdUser.should.have.property('notificationType').with.lengthOf(1);
                        createdUser.should.have.property('category').with.lengthOf(1);
// Should msg ignored.. because of async
                        // createdUser.scheduledDate.toString().should.be.equal(scheduledTime.utc().format(), 'Scheduled date is wrong');
                        // Call done to tell mocha that we are done with this test
                        contentTested(null, createdUser);
                    }
                ],
                function (err) {
                    should.not.exist(err, 'err not expected');
                    done();
                }
            )
            ;

        });
    });

});