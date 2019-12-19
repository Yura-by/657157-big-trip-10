import {getEventsByFilter} from '../utils/filter.js';
import {FilterType} from '../const.js';

export default class Events {
  constructor() {
    this._events = [];
    this._activeFilterType = FilterType.EVERYTHING;

    this._filterChangeHandlers = [];
  }

  getEvents() {
    return getEventsByFilter(this._events, this._activeFilterType);
  }

  getEventsAll() {
    return this._events;
  }

  setEvents(events) {
    this._events = Array.from(events);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  updateEvent(id, event) {
    const index = this._events.findIndex((eventItem) => eventItem.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), event, this._events.slice(index + 1));

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }
}
