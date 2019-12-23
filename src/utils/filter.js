import {sortEventsInOrder, isOneDay} from './common.js';
import {FilterType} from '../const.js';

const getFutureEvents = (events, nowDate) => {

  return events.filter((event) => {
    const {startDate} = event;
    return startDate > nowDate && !isOneDay(startDate, nowDate);
  });
};

const getPastEvents = (events, nowDate) => {

  return events.filter((event) => {
    const {endDate} = event;
    return endDate < nowDate && !isOneDay(endDate, nowDate);
  });
};

export const getEventsByFilter = (events, filterType) => {
  const sortEvents = sortEventsInOrder(events);
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return sortEvents;
    case FilterType.FUTURE:
      return getFutureEvents(sortEvents, nowDate);
    case FilterType.PAST:
      return getPastEvents(sortEvents, nowDate);
  }

  return events;
};
