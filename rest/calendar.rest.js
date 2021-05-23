const express = require("express");
const router = express.Router();
const CalendarService = require("../services/CalendarService.js");
const calendar = require("../models/calendar.schema.js");
const _ = require("lodash");


/**
 * @POST api to create a new event
 * @api /calendar/event
 * @returns created event document
 */
router.post('/event', async (req, res) => {
    const body = req.body;
    let responseObj;
    try {
        // TODO: Need to implement this service
        // if(body.recur)
        //     responseObj = await CalendarService.createRecurringEvents(body);
        // else
        responseObj = await CalendarService.createEvent(body);
        
        res.json(responseObj);
    } catch (err) {
        console.log("Error while creating event: ", err);
        res.json({ message: err });
    }

});

/**
 * @GET api to get all events between the date range given
 * @api /calendar/all?from=&to=
 * @returns all event documents between the date range
 */

// GET ALL CALENDAR EVENTS BETWEEN THE DATE RANGE
router.get("/all", async (req, res)=>{
    const opts = _.assign({},{from: req.query.from, to: req.query.to});
    try {
        const docs = await CalendarService.getAllEvents(opts);
        return res.json(docs);
    } catch (err){
        console.log("Error while fetching events: ", err);
        res.json({ message: err });
    }
});

/**
 * @PUT api to update specific event by event id
 * @api /calendar/event/update/:eventId
 * @returns updated event document
 */

router.put("/event/update/:eventId", async (req, res) => {
    let updatedDoc;
    let body = req.body;
    try {
        // TODO: Need to implement this service
        // if(body.recur && body.repeatOptions && body.repeatOptions.repeat === "weekly")
        //     updatedDoc = await CalendarService.updateRecurringEvents(body);
        // else
            updatedDoc = await CalendarService.updateEvent(req.params.eventId, req.body);
        return res.json(updatedDoc);
    } catch (err) {
        console.log("Error while updating event: ", err);
        res.json({ message: err });
    }
});

/**
 * Recurrence support needs to be given - MUST
 * Add proper readme with all instructions - MUST
 * Add swagger if time permits - OPTIONAL
 * If we create one document at a time, then how can user fetch all future docs by passing date range? Ask Pradeep
 */

module.exports = router;