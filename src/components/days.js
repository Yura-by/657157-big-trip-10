import AbstractComponent from './abstract-component.js';
import moment from 'moment';
import {formatInDay} from '../utils/common.js';

const DAY_COUNTER_CORRECT = 1;
const EMPTY_NUMBER = 0;

const Index = {
  FIRST_DAY: 0,
  LAST_DAY: 1
};

const createDaysMap = (days) => {
  const firstDay = days[Index.FIRST_DAY][Index.FIRST_DAY].startDate;
  const lastDay = days[days.length - Index.LAST_DAY][Index.FIRST_DAY].startDate;
  const dates = [];
  let date = new Date(firstDay);

  while (date <= lastDay) {
    dates.push(formatInDay(date));

    date = new Date(date);
    date.setDate(date.getDate() + DAY_COUNTER_CORRECT);
  }
  if (days.length > Index.LAST_DAY && dates[dates.length - Index.LAST_DAY] !== formatInDay(lastDay)) {
    dates.push(formatInDay(lastDay));
  }

  const daysMap = {};
  dates.forEach((day, index) => {
    daysMap[day] = index + DAY_COUNTER_CORRECT;
  });

  return daysMap;
};

const createDayTemplate = (days) => {
  const daysMap = days.length === EMPTY_NUMBER ? null : createDaysMap(days);

  return days.
    map((events) => {
      const [event] = events;
      let dateTime = ``;
      let dayNumber = ``;
      let date = ``;
      if (daysMap) {
        dateTime = formatInDay(event.startDate);
        dayNumber = daysMap[dateTime];
        date = moment(event.startDate).format(`MMM D`);
      }
      return (
        `<li class="trip-days__item day">
          <div class="day__info">
            <span class="day__counter">${dayNumber}</span>
            <time class="day__date" datetime="${dateTime}">${date}</time>
          </div>

          <ul class="trip-events__list"></ul>
        </li>`
      );
    }).join(`\n`);
};

const createDaysTemplate = (days) => {
  const dayItems = createDayTemplate(days);

  return (
    `<ul class="trip-days">${dayItems}</ul>`
  );
};

export default class Days extends AbstractComponent {
  constructor(days) {
    super();
    this._days = days;
  }

  getTemplate() {
    return createDaysTemplate(this._days);
  }
}
