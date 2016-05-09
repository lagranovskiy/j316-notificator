var _ = require('lodash');
var async = require('neo-async');

var GoogleWorker = require('../workers/GoogleCalWorker');

var EventService = function () {
};

/**
 * Organizes new google event according to the given data
 *
 * var eventRq = {
 *      eventName:'Büchertisch Einsatz Hattersheim',
 *      eventType: 'BUCHERTISCH',
 *      location: 'Hattersheim',
 *      eventDate:'01.06.2016',
  *     eventStartTime:'10:00',
  *     eventEndTime:'12:00',
  *     attendees:[
  *         {
  *             name: Max Mustermann,
  *             phone: 0123658,
  *             email: mmustermann@test.de
  *         },
  *         {
  *             name: Max Braun,
  *             phone: 0123658,
  *             email: mbraun@test.de
  *         }
  *     ]
 * }
 */
EventService.prototype.organizeEvent = function (eventRq, callback) {



};




module.exports = new EventService();