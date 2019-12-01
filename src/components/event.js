import {Types} from '../const.js';

const Index = {
  START_PRETEX_IN: 8,
  UPPERCASE_LETTER: 0,
  DRAIN_LETTER: 1
};

export const createEventTemplate = (event) => {
  const nameImage = event.type === `check` ? `check-in` : event.type;
  let eventName = Types.slice(Index.START_PRETEX_IN).some((name) => event.type === name) ?
  `${event.type} in` : `${event.type} to`;
  eventName = eventName[Index.UPPERCASE_LETTER].toUpperCase() + eventName.slice(Index.DRAIN_LETTER);
  //const time = `${event.startTime.getHours()}:${event.date.getMinutes()}`
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${nameImage}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventName}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-20T08:25">/</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-20T09:25">09:25</time>
          </p>
          <p class="event__duration">1H</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">20</span>
        </p>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};
