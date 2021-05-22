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

module.exports.createEvent = async (payload) => {
    // Validate payload
    await payloadValidation(payload);
    // Check date format
    await isValidDateFormat(payload);
    
    const calModel = new calendarModel(payload);
    // Create document in database
    const doc = await calModel.save();
    return doc;
};

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

module.exports.updateEvent = async (eventId, payload) => {
    const doc = await isDocExists(eventId);
    // If the event document with the eventId does not exist
    if(!doc)
        return Promise.reject({ customCode: 400, message: "Please send a valid eventId" });
    
    // Check the event with eventId is past. It covers for ongoing meeting too.
    if(new Date(payload.startTime) < new Date()){
        return Promise.reject({ customCode: 400, message: "The requested event has already been passed" });
    }
    
    await calendarModel.updateOne({_id: eventId}, {$set: payload}, {new: true});
    const updatedDoc = await calendarModel.findOne({_id: eventId});
    return updatedDoc;
};