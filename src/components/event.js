import {Types} from '../const.js';
import {castTimeFormat} from '../util.js';

const Index = {
  START_PRETEX_IN: 8,
  UPPERCASE_LETTER: 0,
  DRAIN_LETTER: 1
};

const TimeInSec = {
  DAY: 864e5,
  HOUR: 36e5,
  MINUTE: 6e4
};

const createOffersItems = (offers) => {
  return offers.
  map((offer) => {
    const {description, currency, add} = offer;
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${description}</span>
        &plus;
        ${currency}&nbsp;<span class="event__offer-price">${add}</span>
      </li>`
    );
  }).join(`\n`);
};

const createOffers = (offers) => {
  return (
    `<ul class="event__selected-offers">
      ${createOffersItems(offers)}
    </ul>`
  );
};

const createDifferenceTime = (startDate, endDate) => {
  const differenceInSeconds = endDate.getTime() - startDate.getTime();
  const day = Math.floor(differenceInSeconds / TimeInSec.DAY);

  let balanceFromDay = differenceInSeconds;
  if (day > 0) {
    balanceFromDay = differenceInSeconds % TimeInSec.DAY;
  }

  const hour = Math.floor(balanceFromDay / TimeInSec.HOUR);

  let balanceFromHour = differenceInSeconds;
  if (hour > 0 || day > 0) {
    balanceFromHour = differenceInSeconds % TimeInSec.HOUR;
  }
  const minute = Math.floor(balanceFromHour / TimeInSec.MINUTE);

  return {day, hour, minute};
};

const getDifferenceTimeInFormat = (event) => {
  const {startDate, endDate} = event;

  const difference = createDifferenceTime(startDate, endDate);
  const {day, hour, minute} = difference;

  const resultDay = day > 0 ? `${castTimeFormat(day)}D` : ``;
  const resultHour = hour > 0 ? `${castTimeFormat(hour)}H` : ``;
  const resultMinute = minute > 0 ? `${castTimeFormat(minute)}M` : ``;

  return `${resultDay} ${resultHour} ${resultMinute}`;
};

const createEventTemplate = (event) => {
  const {offers, type, startDate, endDate, destination, price} = event;
  const offersComponent = offers.length > 0 ? createOffers(offers) : ``;
  const nameImage = type === `check` ? `check-in` : type;

  let eventName = Types.slice(Index.START_PRETEX_IN).some((name) => type === name) ?
    `${type} in` : `${type} to`;

  eventName = eventName[Index.UPPERCASE_LETTER].toUpperCase() + eventName.slice(Index.DRAIN_LETTER);

  const startTime = `${castTimeFormat(startDate.getHours())}:${castTimeFormat(startDate.getMinutes())}`;
  const endTime = `${castTimeFormat(endDate.getHours())}:${castTimeFormat(endDate.getMinutes())}`;

  const differenceTime = getDifferenceTimeInFormat(event);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${nameImage}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventName} ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-20T08:25">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-20T09:25">${endTime}</time>
          </p>
          <p class="event__duration">${differenceTime}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        ${offersComponent}
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export {createEventTemplate, Index};
