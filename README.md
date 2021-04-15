# rescue-events-api

[![ci](https://github.com/coocos/rescue-events-api/actions/workflows/ci.yml/badge.svg)](https://github.com/coocos/rescue-events-api/actions/workflows/ci.yml)

A service which provides a REST API + WebSocket API for events published by the [Finnish rescue service](http://www.peto-media.fi/).

## How it works

The service periodically polls an RSS feed published by the Finnish rescue service, which contains the last 100 reported rescue events. The events found from the feed are persisted into a PostgreSQL database and the service provides a REST API for querying the events. Additionally, whenever a new event is found from the feed, the event is pushed to all currently connected WebSocket clients. Using these two APIs you could for example build a real-time'ish accident dashboard.

## REST API

There's essentially a single, simple endpoint which you can use to query the service:

- `GET /api/v1/events/` will return all events and they look like this:

```json
[
  {
    "type": "rakennuspalo: pieni",
    "location": "Kokkola",
    "time": "2021-03-01T15:59:04.000Z"
  },
  {
    "type": "rakennuspalo: pieni",
    "location": "Helsinki",
    "time": "2021-03-01T15:40:52.000Z"
  }
]
```

You probably shouldn't call this endpoint if you've been running the service for a while, because it will return _all_ events it has persisted from the feed. This could be tens of thousands of events! However, can use filters to narrow down your search. For example, to narrow down to a specific a time range using ISO-8601:

- `GET /api/v1/events/?start=2020-04-05T00:00:00.000Z&end=2020-04-06T00:00:00.000Z` will return all events which occurred during 5th of April 2020.

Or you could narrow down by using both location and start time:

- `GET /api/v1/events/?start=2020-04-01T00:00:00.000Z&location=Helsinki` will return all events which have occurred in Helsinki since 1st of April 2020.

## WebSocket API

The service will also publish any new rescue events found to all currently connected WebSocket clients. To connect to the service, to establish a WebSocket connection to `/websocket`. For example, using JavaScript:

```javascript
const socket = new WebSocket("ws://localhost:8000/websocket");
socket.onmessage = (msg) => console.log(JSON.parse(msg.data));
```

The published events look just like the events returned by the REST API:

```json
{
  "type": "rakennuspalo: pieni",
  "location": "Helsinki",
  "time": "2021-03-01T15:40:52.000Z"
}
```

## Running the service

You can start the service with:

```
npm start
```

The service will automatically reload if you make any changes to the code. You can also use docker-compose to start both the service and PostgreSQL using containers:

```
docker-compose up
```

## Configuring the service

You can use the following environment variables to configure portions of the service:

* `PORT` - port to listen on
* `FEED_SCHEDULE` - how often to poll the feed for changes using [cron syntax](https://en.wikipedia.org/wiki/Cron#Overview)
* `DB_HOST` - database host (defaults to localhost)
* `DB_PORT` - database port (defaults to 5432)
* `DB_NAME` - database name
* `DB_USER` - database user
* `DB_PASSWORD` - database password

## Tests

You can run a set of unit tests with:

```
npm test
```

There is also a set of integration tests which you can run with:

```
npm run integration
```

Note that you need a PostgreSQL instance for the integration tests.
