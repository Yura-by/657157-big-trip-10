import {getEventsByFilter} from '../utils/filter.js';
import {FilterType} from '../const.js';

const Index = {
  FIRST: 0,
  NEXT: 1,
  NOT_FOUND: -1
};

export default class Events {
  constructor() {
    this._events = [];
    this._activeFilterType = FilterType.EVERYTHING;
    this._destinations = [];
    this._offers = [];

    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
    this._updateChangeHandlers = [];
  }

  updateEvents(events) {
    this._events = events;
    this._callHandlers(this._dataChangeHandlers);
    this._callHandlers(this._updateChangeHandlers);
  }

  getEvents() {
    return getEventsByFilter(this._events, this._activeFilterType);
  }

  getEventsAll() {
    return this._events;
  }

  setEvents(events) {
    this._events = Array.from(events);
    this._callHandlers(this._dataChangeHandlers);
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getDestinations() {
    return this._destinations;
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getOffers() {
    return this._offers;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  removeEvent(id) {
    const index = this._events.findIndex((eventItem) => eventItem.id === id);

    if (index === Index.NOT_FOUND) {
      return false;
    }

    this._events = [].concat(this._events.slice(Index.FIRST, index), this._events.slice(index + Index.NEXT));


    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  updateEvent(id, event) {
    const index = this._events.findIndex((eventItem) => eventItem.id === id);

    if (index === Index.NOT_FOUND) {
      return false;
    }

    this._events = [].concat(this._events.slice(Index.FIRST, index), event, this._events.slice(index + Index.NEXT));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addEvent(event) {
    this._events = [].concat(event, this._events);
    this._callHandlers(this._dataChangeHandlers);
  }

  getFilterName() {
    return this._activeFilterType;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setDataUpdateHandler(handler) {
    this._updateChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
