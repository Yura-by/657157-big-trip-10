import AbstractComponent from './abstract-component.js';
import moment from 'moment';

const DAY_COUNTER_CORRECT = 1;
const INDEX_DAY = 0;

const createDayTemplate = (days) => {
  return days.
  map((events, index, array) => {
    const [event] = events;
    let dayNumber = DAY_COUNTER_CORRECT;
    if (index !== 0) {
      dayNumber += moment(event.startDate).diff(moment(array[INDEX_DAY][INDEX_DAY].startDate), `days`);
    }
    const date = moment(event.startDate).format(`MMM D`);
    return (
      `<li class="trip-days__item day">
        <div class="day__info">
          <span class="day__counter">${dayNumber}</span>
          <time class="day__date" datetime="2019-03-18">${date}</time>
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
