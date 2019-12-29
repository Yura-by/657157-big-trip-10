import {castTimeFormat, formatInTime, getDestinationTitle} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';
import moment from 'moment';

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

const getDifferenceTimeInFormat = (event) => {
  const {startDate, endDate} = event;

  const durationEvent = moment.duration(moment(endDate).diff(moment(startDate)));
  const day = durationEvent.days();
  const hour = durationEvent.hours();
  const minute = durationEvent.minutes();

  const resultDay = day > 0 ? `${castTimeFormat(day)}D` : ``;
  const resultHour = hour > 0 ? `${castTimeFormat(hour)}H` : ``;
  const resultMinute = minute > 0 ? `${castTimeFormat(minute)}M` : ``;

  return `${resultDay} ${resultHour} ${resultMinute}`;
};

const createEventTemplate = (event) => {
  const {offers, type, startDate, endDate, destination, price} = event;
  const offersComponent = offers.length > 0 ? createOffers(offers) : ``;
  const nameImage = type === `check` ? `check-in` : type;

  const eventName = getDestinationTitle(type);

  const startTime = formatInTime(startDate);
  const endTime = formatInTime(endDate);

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

export default class Event extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  setRollupButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, handler);
  }
}
