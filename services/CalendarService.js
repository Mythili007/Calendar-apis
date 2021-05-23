const Promise = require('bluebird');
const calendarModel = require("../models/calendar.schema.js");
const _ = require("lodash");

async function isValidDateFormat(data) {
    if (new Date(data.startTime).toString() === "Invalid Date" || new Date(data.endTime).toString() === "Invalid Date") 
        return Promise.reject({ customCode: 400, message: "Please send valid date" });
}


async function payloadValidation(payload) {
    if (!payload.startTime || !payload.title || !payload.endTime)
        return Promise.reject({ customCode: 400, message: "Please send necessary information" });
}

/**
 * createEvent: This is to create a calendar event
 * @params necessary fields including title of an event, start time, end time.
 * @returns created event document
 */

module.exports.createEvent = async (payload) => {
    // Validate payload
    await payloadValidation(payload);
    // Check date format
    await isValidDateFormat(payload);
    
    const calModel = new calendarModel(payload);
    // Create document in database
    const doc = await calModel.save();

    /**
     * For recurrence: 
     * 1. Fetch the date based on the repeatOptions.daysOfWeek.
        * For example today is Sunday, if user selects Monday, Tuesday, we first fetch the tomorrow's date
     * 2. Schedule an agenda job for tomorrow.
     * 3. Agenda JOB: It first fetches the event document, create a clone by maintaining parent eventid and send this document to the message queue (RabbitMQ job)
     * 4. RabbitMQ JOB: It updates the time in the current document and check for the other days of week.
        * If more days are there (In the above example, we need to send the event update to user on Tuesday too) it first schedules another agenda job for Tuesday
        * Updates the document and returns it
        * If we need to notify user through reminders then we can send mails or reminder notifications at this point
        * For sending mails/notifications we can run another asynchronous rabbitmq job, so that if anything goes wrong we will get to know at which stage it fails.
     */

    return doc;
};

/**
 * getAllEvents: This is to fetch all events between the given date range
 * @params from and to
 * NOTE: from and to are optional, all combinations for these are handled
 * @returns all event documents between the given date range
 */

module.exports.getAllEvents = async (opts) => {
    let docs;
    let dbQuery = {};
    let from = new Date(opts.from);
    let to = new Date(opts.to);
    // If both from date and to dates are given
    if(!_.isEmpty(opts.from) && !_.isEmpty(opts.to))
        dbQuery = {$and: [{startTime: {$gte: from}}, {startTime: {$lte: to}}]}
    
    // If only to date is given
    if (_.isEmpty(opts.from) && !_.isEmpty(opts.to))
        dbQuery = {$and: [{startTime: {$gte: new Date()}}, {startTime: {$lte: to}}]};
    
    // If only from date is given
    if (!_.isEmpty(opts.from) && _.isEmpty(opts.to))
        dbQuery = {startTime: {$gte: from}};

    docs = await calendarModel.find(dbQuery);
    return docs;
};

async function isDocExists(eventId){
    const doc = await calendarModel.findOne({_id: eventId});
    return (doc) ? true : false; 
}

/**
 * updateEvent: This is to update a specific event by eventId
 * @params eventId, other info that needs to be updated
 * @returns updated event document
 */

module.exports.updateEvent = async (eventId, payload) => {
    const doc = await isDocExists(eventId);
    // If the event document with the eventId does not exist
    if(!doc)
        return Promise.reject({ customCode: 400, message: "Please send a valid eventId" });
    
    // Check the event with eventId is past. It covers for ongoing meeting too.
    if(new Date(payload.startTime) < new Date()){
        return Promise.reject({ customCode: 400, message: "The requested event has already been passed" });
    }

    /**
     * For recurrence: 
     * 1. Fetch the date based on the repeatOptions.daysOfWeek.
        * For example today is Sunday, if user selects Monday, Tuesday, we first fetch the tomorrow's date
     * 2. Schedule an agenda job for tomorrow.
     * 3. Agenda JOB: It first fetches the child document by parentId, and send this document to the message queue (RabbitMQ job)
     * 4. RabbitMQ JOB: It updates the time in the current document and check for the other days of week.
        * If more days are there (In the above example, we need to send the event update to user on Tuesday too) it first schedules another agenda job for Tuesday
        * Updates the document and returns it
        * If we need to notify user through reminders then we can send mails or reminder notifications at this point
        * For sending mails/notifications we can run another asynchronous rabbitmq job, so that if anything goes wrong we will get to know at which stage it fails.
     */
    
    await calendarModel.updateOne({_id: eventId}, {$set: payload}, {new: true});
    const updatedDoc = await calendarModel.findOne({_id: eventId});
    return updatedDoc;
};