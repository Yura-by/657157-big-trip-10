import moment from 'moment';
import {TYPES_PLACE, Type, Index} from '../const.js';


export const getOffersByType = (type, allOffers) => {
  return allOffers.filter((item) => item[`type`] === type)[0].offers;
};

export const getDestinationTitle = (type) => {
  if (type === Type.CHECK) {
    return `Check-In in`;
  }
  const eventName = TYPES_PLACE.some((name) => type === name) ?
    `${type} in` : `${type} to`;

  return eventName[Index.UPPERCASE_LETTER].toUpperCase() + eventName.slice(Index.DRAIN_LETTER);
};

export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatInDay = (date) => {
  return moment(date).format(`YYYY-MM-DD`);
};

export const formatInDayTime = (date) => {
  return moment(date).format(`DD/MM/YYYY HH:mm`);
};

export const formatInTime = (date) => {
  return moment(date).format(`HH:mm`);
};

export const sortEventsInOrder = (events) => {
  return events.sort((eventBefore, eventAfter) => eventBefore.startDate.getTime() - eventAfter.startDate.getTime());
};

export const isOneDay = (dateA, dateB) => {
  const momentDateA = moment(dateA);
  const momentDateB = moment(dateB);
  return momentDateA.diff(momentDateB, `days`) === 0;
};

export const getDateObject = (string) => {
  return moment(string, `DD/MM/YYYY HH:mm`).toDate();
};
