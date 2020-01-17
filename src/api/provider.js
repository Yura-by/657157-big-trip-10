import Event from "../models/event.js";

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  getEvents() {
    if (this._isOnLine()) {
      return this._api.getEvents().then(
          (events) => {
            this._store.clear();
            events.forEach((event) => this._store.setItem(event.id, event.toRAW()));
            return events;
          }
      );
    }

    const storeEvents = Object.values(this._store.getAll());
    this._isSynchronized = false;
    return Promise.resolve(Event.parseEvents(storeEvents));
  }

  getDestinations() {
    return this._api.getDestinations()
  }

  getOffers() {
    return this._api.getOffers()
  }

  updateEvent(id, event) {
    if (this._isOnLine()) {
      return this._api.updateEvent(id, event).then(
          (newEvent) => {
            this._store.setItem(newEvent.id, newEvent.toRAW());
            return newEvent;
          }
      );
    }
    const fakeUpdatedEvent = Event.parseEvent(Object.assign({}, event.toRAW(), {id}));
    this._isSynchronized = false;
    this._store.setItem(id, Object.assign({}, fakeUpdatedEvent.toRAW(), {offline: true}));

    return Promise.resolve(fakeUpdatedEvent);
  }

  createEvent(event) {
    if (this._isOnLine()) {
      return this._api.createEvent(event).then(
          (newEvent) => {
            this._store.setItem(newEvent.id, newEvent.toRAW());
            return newEvent;
          }
      );
    }
    const fakeNewEventId = String(new Date() + Math.random());
    const fakeNewEvent = Event.parseEvent(Object.assign({}, event.toRAW(), {id: fakeNewEventId}));
    this._isSynchronized = false;
    this._store.setItem(fakeNewEvent.id, Object.assign({}, fakeNewEvent.toRAW(), {offline: true}));

    return Promise.resolve(fakeNewEvent);
  }

  deleteEvent(id) {
    if (this._isOnLine()) {
      return this._api.deleteEvent(id).then(
          () => {
            this._store.removeItem(id);
          }
      );
    }
    this._isSynchronized = false;
    this._store.removeItem(id);
    return Promise.resolve();
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
