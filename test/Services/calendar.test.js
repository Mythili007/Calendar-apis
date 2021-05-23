const expect = require('chai').expect;
const CalendarService = require("../../services/CalendarService.js");
const fixtures = require("../fixtures/calendar.fixture.js");
const CalenderModel = require("../../models/calendar.model.js");
const mongoUrl = process.env.DB_CONNECTION;
const prepare = require('mocha-prepare')
const mongoUnit = require('mongo-unit')

describe('Calendar apis uni tests', () => {
    // It should connect to fake db and should not hamper the original.. WIP
    beforeEach(() => {
        prepare(done => mongoUnit.start()
            .then(testMongoUrl => {
                process.env.MONGO_URL = testMongoUrl
                done()
            }));
    });

    afterEach(()=> mongoUnit.drop());

    describe('Create event unit test', async () => {
        it('User should be able to create event', async () => {
            const {
                payload
            } = fixtures;
            const result = await CalendarService.createEvent(payload);
            expect(result).to.be.deep.equal(fixtures.response);
        });
    });
    // done();
});