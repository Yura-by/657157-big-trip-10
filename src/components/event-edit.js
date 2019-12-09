import {TYPES, Index} from '../const.js';
import {castTimeFormat} from '../utils/common.js';
import {CITIES} from '../mock/event.js';
import AbstractComponent from './abstract-component.js';

const IndexNumber = {
  YEAR_FORMAT: 1,
  ITEM_TRANSFER: 0,
  ITEM_ACTIVITY: 7
};

const TypeCheck = {
  IN_DATA: `check`,
  OUT_DATA: `check-in`
};

const createEventTypeItems = (indexStart, indexEnd) => {
  return TYPES.slice(indexStart, indexEnd).map((type) => {
    if (type === TypeCheck.IN_DATA) {
      type = TypeCheck.OUT_DATA;
    }
    let typeName = type;
    typeName = typeName[Index.UPPERCASE_LETTER].toUpperCase() + typeName.slice(Index.DRAIN_LETTER);
    return (
      `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${typeName}</label>
      </div>`
    );
  }).join(`\n`);
};

const createDestinationOptions = (destinations) => {
  return destinations.map((destination) => {
    return (
      `<option value="${destination}"></option>`
    );
  }).join(`\n`);
};

const createEventEditTemplate = (event) => {
  const {startDate, endDate, price, type, destination} = event;
  const nameImage = type === `check` ? `check-in` : type;

  let eventName = TYPES.slice(Index.START_PRETEX_IN).some((name) => event.type === name) ?
    `${type} in` : `${type} to`;

  eventName = eventName[Index.UPPERCASE_LETTER].toUpperCase() + eventName.slice(Index.DRAIN_LETTER);

  const createDateInFormat = (date) => {
    return (
      `${castTimeFormat(date.getDate())}/${castTimeFormat(date.getMonth())}/${String(date.getYear()).slice(IndexNumber.YEAR_FORMAT)} ${castTimeFormat(date.getHours())}:${castTimeFormat(date.getMinutes())}
      `);
  };

  const startTime = createDateInFormat(startDate);
  const endTime = createDateInFormat(endDate);
  const eventTypeItemTransfer = createEventTypeItems(IndexNumber.ITEM_TRANSFER, IndexNumber.ITEM_ACTIVITY);
  const eventTypeItemActivity = createEventTypeItems(IndexNumber.ITEM_ACTIVITY, TYPES.length);
  const destinationOptions = createDestinationOptions(CITIES);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${nameImage}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${eventTypeItemTransfer};

            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${eventTypeItemActivity};

            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${eventName}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationOptions}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="  ${endTime}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
    </form>`
  );
};

export default class EventEdit extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createEventEditTemplate(this._event);
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
  }
}
