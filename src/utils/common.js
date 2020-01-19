import moment from 'moment';
import {TYPES_PLACE, Type, Index} from '../const.js';

const NO_DAYS = 0;
const TIME_COMPARATOR = 10;

export const getDestinationTitle = (type) => {
  if (type === Type.CHECK) {
    return `Check-In in`;
  }
  const eventName = TYPES_PLACE.some((name) => type === name) ?
    `${type} in` : `${type} to`;

  return eventName[Index.UPPERCASE_LETTER].toUpperCase() + eventName.slice(Index.DRAIN_LETTER);
};

export const castTimeFormat = (value) => {
  return value < TIME_COMPARATOR ? `0${value}` : String(value);
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

export const formatForTitle = (date) => {
  return moment(date).format(`D MMM`);
};

export const sortEventsInOrder = (events) => {
  return events.sort((eventBefore, eventAfter) => eventBefore.startDate.getTime() - eventAfter.startDate.getTime());
};

export const isOneDay = (dateA, dateB) => {
  const momentDateA = moment(dateA);
  const momentDateB = moment(dateB);
  return momentDateA.diff(momentDateB, `days`) === NO_DAYS && dateA.getDate() === dateB.getDate();
};

export const getDateObject = (string) => {
  return moment(string, `DD/MM/YYYY HH:mm`).toDate();
};
