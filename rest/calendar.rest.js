const express = require("express");
const router = express.Router();
const CalendarService = require("../services/CalendarService.js");
const calendar = require("../models/calendar.schema.js");
const _ = require("lodash");

/* router.get('/', (req, res) => {
    res.send("Hello!! Wassup");
}); */

router.post('/event', async (req, res) => {
    const body = req.body;
    let responseObj;
    try {
        // TODO: Need to implement this service
        if(body.repeatOptions && repeatOptions.repeat === "weekly")
            responseObj = await CalendarService.createRecurringEvents(body);
        else
            responseObj = await CalendarService.createEvent(body);
        
        res.json(responseObj);
    } catch (err) {
        console.log("Error while creating event: ", err);
        res.json({ message: err });
    }

});

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

// UPDATE DATE OR TIME IN ANY EVENT
router.put("/event/update/:eventId", async (req, res) => {
    let updatedDoc;
    let body = req.body;
    try {
        // TODO: Need to implement this service
        if(body.repeatOptions && body.repeatOptions.repeat === "weekly")
            updatedDoc = await CalendarService.updateRecurringEvents(body);
        else
            updatedDoc = await CalendarService.updateEvent(req.params.eventId, req.body);
        return res.json(updatedDoc);
    } catch (err) {
        console.log("Error while updating event: ", err);
        res.json({ message: err });
    }
});

module.exports = router;