import {formatForTitle} from './common.js';

const Number = {
  FIRST_ELEMENT: 0,
  MIN_LENGTH: 1,
  MIDDLE_LENGTH: 2,
  MAX_LENGTH: 3
};

export const getTripInfoContent = (events) => {
  let titleValue = ``;
  let dateValue = ``;

  switch (true) {
    case (events.length === Number.MIN_LENGTH):
      titleValue = events[Number.FIRST_ELEMENT].destination.name;
      dateValue = formatForTitle(events[Number.FIRST_ELEMENT].startDate);
      break;
    case (events.length === Number.MIDDLE_LENGTH):
      titleValue = `${events[Number.FIRST_ELEMENT].destination.name} &mdash; ${events[events.length - Number.MIN_LENGTH].destination.name}`;
      break;
    case (events.length === Number.MAX_LENGTH):
      titleValue = `${events[Number.FIRST_ELEMENT].destination.name} &mdash; ${events[Number.MIN_LENGTH].destination.name} &mdash; ${events[events.length - Number.MIN_LENGTH].destination.name}`;
      break;
    case (events.length > Number.MAX_LENGTH):
      titleValue = `${events[Number.FIRST_ELEMENT].destination.name} &mdash; ... &mdash; ${events[events.length - Number.MIN_LENGTH].destination.name}`;
      break;
  }

  if (events.length > Number.MIN_LENGTH) {
    dateValue = `${formatForTitle(events[Number.FIRST_ELEMENT].startDate)} &mdash; ${formatForTitle(events[events.length - Number.MIN_LENGTH].endDate)}`;
  }

  return {
    title: `${titleValue}`,
    date: `${dateValue}`
  };
};
