const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    endTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: {
        type: String,
        required: false,
    },
    cOn: {
        type: Date,
        default: Date.now,
    },
    mOn: {
        type: Date,
        default: Date.now,
    },
    repeatOptions: {
        repeat: {
            type: String,
            enum: ["none", "daily", "weekly", "monthly", "yearly"],
            default: "none",
        },
        interval: {
            type: Number,
            default: 1,
        },
        daysOfWeek: {
            type: Array,
            default: [0, 0, 0, 0, 0, 0, 0],
        },
        dateInMonth: {
            type: Number,
            default: 0,
        },
        lastDayOfMonth: {
            type: Boolean,
            default: false,
        },
        weeksInMonth: {
            type: Array,
            default: [0, 0, 0, 0, 0],
        },
        endDate: {
            type: Date,
            default: Date.now,
        },
        repeatUntill: {
            type: String,
            default: null,
        },
        timeZone: {
            type: String,
            default: null,
        },
    }
});

module.exports = mongoose.model('events', calendarSchema);