import Event from "../models/event.js";

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success).map(({payload}) => payload.point);
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  sync() {
    if (this._isOnLine()) {
      const storeEvents = Object.values(this._store.getAll());
      const eventsToSend = storeEvents.map((event) => Object.assign({}, event));
      eventsToSend.forEach((event) => {
        if (event.hasOwnProperty(`offline`)) {
          delete event.offline;
        }
      });

      return this._api.sync(eventsToSend)
        .then((response) => {
          storeEvents.filter((event) => event.offline).forEach((event) => {
            this._store.removeItem(event.id);
          });
          const createdEvents = response.created;
          const updatedEvents = getSyncedEvents(response.updated);
          const synchronizedEvents = createdEvents.concat(updatedEvents);
          synchronizedEvents.forEach((event) => {
            this._store.setItem(event.id, event);
          });

          this._isSynchronized = true;

          return Promise.resolve(Event.parseEvents(synchronizedEvents));
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
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
    if (this._isOnLine()) {
      return this._api.getDestinations().then(
          (destinations) => {
            this._store.setDestinations(destinations);
            return destinations;
          }
      );
    }

    return Promise.resolve(this._store.getDestinations());
  }

  getOffers() {
    if (this._isOnLine()) {
      return this._api.getOffers().then(
          (offers) => {
            this._store.setOffers(offers);
            return offers;
          }
      );
    }

    return Promise.resolve(this._store.getOffers());
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
    const fakeNewEventId = String(Number(new Date()) + Math.random());
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

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
