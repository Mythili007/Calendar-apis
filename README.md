# My calendar
    My calendar project is to create events for a specific date and time, update specific event by just passing the event id. Support for fetching all the documents between the given the date range is also handled. Get events api is developed in such a way that user can optionally pass "from" and "to" dates.

    NOTE: The database is hosted on cloud using mongodb atlas where a cluster has been created and all the documents would be stored under "events" collection in Calendar database.

    Pseudo code: pseudocode.txt file can be found in the main folder.

# Folder structure
    .
    ├── rest                    # Rest layer where all apis are written
    │   ├── calendar.rest.js    # APIs
    ├── services                # Service layer which handles business logic
    │   ├── CalendarService.js  # Service file
    ├── models                  # Model layer for database model methods
    │   ├── calendar.schema.js  # DB schema for event
    ├── test                    # Unit tests (chai and mocha based)
    │   ├── fixtures            # Calendar fixture
    |   |   ├── calendar.fixture.js  # Test data
    │   ├── Services            # Tests for service files
    │   |   ├── calendar.test.js     # Unit tests for APIs
    ├── index.js                # Source file to start the node service
    ├── pseudocode.txt          # Pseudo code for all the apis. Recurring pseudo code is added
    ├── test.http               # Apis are tested using vscode extension [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
    └── README.md               # Full documentation about the My calendar apis

## Run the service
    node index.js

# REST APIs
## Create an event

### Request

`POST /calendar/event`

    curl -i -H 'Accept: application/json' http://localhost:5001/calendar/event

### Response
    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 467
    ETag: W/"1d3-gcmKQMux4sduJwa9yUOm22LZG6E"
    Date: Sun, 23 May 2021 13:47:01 GMT
    Connection: close

    {
        "recur": false,
        "_id": "60aa5d68ecddb43106b211c3",
        "title": "Event10",
        "startTime": "2021-05-26T21:30:39.000Z",
        "endTime": "2021-05-26T21:30:39.000Z",
        "description": "My tenth event",
        "cOn": "2021-05-23T13:49:28.069Z",
        "mOn": "2021-05-23T13:49:28.069Z",
        "__v": 0
    }

## Update a specific event

### Request

`PUT /calendar/event/update/:eventId`

    curl -i -H 'Accept: application/json' http://localhost:5001/calendar/event/update/60aa5d68ecddb43106b211c3

### Response
    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 255
    ETag: W/"ff-Vjkz2yHijxVK999JHAnUpfrLJnE"
    Date: Sun, 23 May 2021 13:55:47 GMT
    Connection: close

    {
        "recur": false,
        "_id": "60aa5d68ecddb43106b211c3",
        "title": "Event10_udpated",
        "startTime": "2021-05-27T13:00:00.000Z",
        "endTime": "2021-05-26T21:30:39.000Z",
        "description": "My tenth event",
        "cOn": "2021-05-23T13:49:28.069Z",
        "mOn": "2021-05-23T13:49:28.069Z",
        "__v": 0
    }

## Update past event 

### Request

`PUT /calendar/event/update/:eventId`

    curl -i -H 'Accept: application/json' http://localhost:5001/calendar/event/update/60a91cc0e702de02fb5b1759

### Response
    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 86
    ETag: W/"56-WAS7cbcijDTg/bTSFjlZM1Z9KM8"
    Date: Sun, 23 May 2021 13:51:07 GMT
    Connection: close

    {
        "message": {
            "customCode": 400,
            "message": "The requested event has already been passed"
        }
    }


## Get all events in a given range
### Request
`GET /calendar/all?from=2021-05-22T13:00:00.000Z&to=2021-05-24T13:00:00.000Z`

    curl -i -H 'Accept: application/json' http://localhost:5001/calendar/all   
### Response
    [
        {
            "recur": false,
            "_id": "60a91cc0e702de02fb5b1759",
            "title": "Event1_udpated",
            "startTime": "2021-05-23T13:00:00.000Z",
            "description": "My first event",
            "__v": 0,
            "endTime": "2021-05-23T13:57:23.166Z",
            "cOn": "2021-05-23T13:57:23.166Z",
            "mOn": "2021-05-23T13:57:23.166Z"
        },
        {
            "recur": false,
            "_id": "60a91d1082ec3103f0be2f33",
            "title": "Event2",
            "startTime": "2021-05-22T13:22:39.000Z",
            "description": "My second event",
            "__v": 0,
            "endTime": "2021-05-23T13:57:23.166Z",
            "cOn": "2021-05-23T13:57:23.167Z",
            "mOn": "2021-05-23T13:57:23.167Z"
        }
    ]

