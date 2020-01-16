export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getEvents() {
    return this._api.getEvents();
  }

  getDestinations() {
    return this._api.getDestinations()
  }

  getOffers() {
    return this._api.getOffers()
  }

  updateEvent(id, data) {
    return this._api.updateEvent(id, data);
  }

  createEvent(data) {
    return this._api.createEvent(data);
  }

  deleteEvent(id) {
    return this._api.deleteEvent(id);
  }
}
