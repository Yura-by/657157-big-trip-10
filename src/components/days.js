import AbstractComponent from './abstract-component.js';
import moment from 'moment';

const DAY_COUNTER_CORRECT = 1;

const createDayTemplate = (days) => {
  return days.
  map((events, index) => {
    const [event] = events;

    const date = moment(event).format(`MMM D`);
    return (
      `<li class="trip-days__item day">
        <div class="day__info">
          <span class="day__counter">${index + DAY_COUNTER_CORRECT}</span>
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
