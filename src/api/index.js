import Event from '../models/event.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const Status = {
  MIN: 200,
  MAX: 300
};

const checkStatus = (response) => {
  if (response.status >= Status.MIN && response.status < Status.MAX) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class Index {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  sync(events) {
    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(events),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json());
  }

  getEvents() {
    return this._load({url: `points`})
      .then((response) => response.json())
      .then(Event.parsePoints);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then((response) => response.json());
  }

  getOffers() {
    return this._load({url: `offers`})
      .then((response) => response.json());
  }

  updateEvent(id, event) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(event.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(Event.parsePoint);
  }

  createEvent(event) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(event.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(Event.parsePoint);
  }

  deleteEvent(id) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
