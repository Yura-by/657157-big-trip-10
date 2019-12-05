import {MONTHS} from '../const.js';

const DAY_COUNTER_CORRECT = 1;

export const createDayTemplate = (days) => {
  return days.
  map((events, index) => {
    const [event] = events;

    const date = `${MONTHS[event.startDate.getMonth()]} ${event.startDate.getDate()}`;
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
