import moment from 'moment';
import {TYPES_PLACE, Type, Index} from '../const.js';

const NO_DAYS = 0;
const TIME_COMPARATOR = 10;

const getDestinationTitle = (type) => {
  if (type === Type.CHECK) {
    return `Check-In in`;
  }
  const eventName = TYPES_PLACE.some((name) => type === name) ?
    `${type} in` : `${type} to`;

  return eventName[Index.UPPERCASE_LETTER].toUpperCase() + eventName.slice(Index.DRAIN_LETTER);
};

const castTimeFormat = (value) => {
  return value < TIME_COMPARATOR ? `0${value}` : String(value);
};

const formatInDay = (date) => {
  return moment(date).format(`YYYY-MM-DD`);
};

const formatInDayTime = (date) => {
  return moment(date).format(`DD/MM/YYYY HH:mm`);
};

const formatInTime = (date) => {
  return moment(date).format(`HH:mm`);
};

const formatForTitle = (date) => {
  return moment(date).format(`D MMM`);
};

const sortEventsInOrder = (events) => {
  return events.sort((eventBefore, eventAfter) => eventBefore.startDate.getTime() - eventAfter.startDate.getTime());
};

const isOneDay = (dateA, dateB) => {
  const momentDateA = moment(dateA);
  const momentDateB = moment(dateB);
  return momentDateA.diff(momentDateB, `days`) === NO_DAYS && dateA.getDate() === dateB.getDate();
};

const getDateStructure = (date) => {
  return moment(date, `DD/MM/YYYY HH:mm`).toDate();
};

export {getDestinationTitle, castTimeFormat, formatInDay, formatInDayTime, formatInTime, formatForTitle, sortEventsInOrder, isOneDay, getDateStructure};
