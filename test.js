var google = require('googleapis');
var googleAuthInfo = JSON.parse( process.env.GOOGLE_ACCESS_JSON);

var jwtClient = new google.auth.JWT(googleAuthInfo.client_email, null, googleAuthInfo.private_key, ['https://www.googleapis.com/auth/calendar'], null);

delete process.env.https_proxy;
console.info(process.env.https_proxy);

var calendar = google.calendar('v3');

jwtClient.authorize(function(err, tokens) {
    if (err) {
        console.log(err);
        return;
    }






});


var event = {
    summary: 'Test Event',
    location: 'Hattersheim',
    description: 'Test event description',
    creator:{
        displayName:'Gemeinde FFM',
        email:'test@agranovskiy.de'
    },
    start: {
        dateTime: '2016-05-28T10:00:00',
        timeZone: 'Europe/Berlin',
    },
    end: {
        dateTime: '2016-05-28T12:00:00',
        timeZone: 'Europe/Berlin',
    },
    attendees: [
        {email: 'leonid.agranovskiy@gmail.com'},
        {email: 'test@agranovskiy.de'}
    ],
    reminders: {
        useDefault: false,
        overrides: [
            {method: 'email', 'minutes': 24 * 60},
        ],
    },
};


calendar.events.insert({
    auth: jwtClient,
    sendNotifications:true,
    calendarId: 'v4kns2o14l31tvagfcv0i8go9k@group.calendar.google.com',
    resource: event,
}, function(err, event) {
    if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return;
    }
    console.log('Event created: %s', event.htmlLink);
});

/**
calendar.calendars.insert({
    auth: jwtClient,
    resource: {
        summary:"Test Calendar"
    }
}, function(err, data) {
    if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return;
    }
    console.log(data);
});

calendar.calendarList.list({
    auth: jwtClient,
    calendarId: 'primary'
}, function(err, data) {
    if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return;
    }
    console.log(data);
});

 */