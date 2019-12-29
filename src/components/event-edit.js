import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import {TYPES_TRANSPORT, TYPES_PLACE, Index} from '../const.js';
import {CITIES} from '../mock/event.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import {generateRandomOffers, generateRandomDescription, generateRandomPhotos, OFFERS} from '../mock/event.js';
import {getDateObject, formatInDayTime, getDestinationTitle} from '../utils/common.js';

const TypeCheck = {
  IN_DATA: `check`,
  OUT_DATA: `check-in`
};

const descriptionMap = {
  'Add luggage': `luggage`,
  'Switch to comfort class': `comfort`,
  'Add meal': `meal`,
  'Choose seats': `seats`
};

const createId = (description, count) => {
  return (
    `${descriptionMap[description]}-${count}`
  );
};

const createSelectors = (offers) => {
  return offers.
  map((offer, count) => {
    const {description, currency, add} = offer;
    const idName = createId(description, count);
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${idName}" type="checkbox" name="${description}" checked>
        <label class="event__offer-label" for="event-offer-${idName}">
          <span class="event__offer-title">${description}</span>
          &plus;
          ${currency}&nbsp;<span class="event__offer-price">${add}</span>
        </label>
      </div>`
    );
  }).join(`\n`);
};

const createEventOffersTemplate = (offers) => {
  const offerSelectors = offers.length > 0 ? createSelectors(offers) : ``;
  return offers.length > 0 ? (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offerSelectors}
      </div>
    </section>`
  )
    : ` `;
};

const createEventTypeItems = (types) => {
  return types.map((type) => {
    if (type === TypeCheck.IN_DATA) {
      type = TypeCheck.OUT_DATA;
    }
    let typeName = type;
    typeName = typeName[Index.UPPERCASE_LETTER].toUpperCase() + typeName.slice(Index.DRAIN_LETTER);
    return (
      `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="type" value="${type}">
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

const createImagesItems = (photos) => {
  return photos.
  map((soursePhoto) => {
    return (
      `<img class="event__photo" src="${soursePhoto}" alt="Event photo">`
    );
  }).join(`\n`);
};

const createImagesTemplate = (photo) => {
  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${createImagesItems(photo)}
      </div>
    </div>`
  );
};

const createEventDescriptionTemplate = (description, photo) => {
  const descriptionImages = photo.length > 0 ? createImagesTemplate(photo) : ``;
  return description.length > 0 ? (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      ${descriptionImages}
    </section>`
  )
    : ` `;
};

const createEventDetails = (event, offers, description, photo) => {
  const offersTemplate = createEventOffersTemplate(offers);
  const descriptionTemplate = createEventDescriptionTemplate(description, photo);
  const detailsTemplate = (description || (offers.length > 0)) ?
    `<section class="event__details">${offersTemplate} ${descriptionTemplate}</section>` : ``;
  return detailsTemplate;
};

const createEventEditTemplate = (options = {}, isNewEvent) => {


  const {type, offers, destination, description, photo, startDate, endDate, price, isFavorite} = options;

  const nameImage = type === `check` ? `check-in` : type;

  const eventName = getDestinationTitle(type);

  const eventTypeItemTransfer = createEventTypeItems(TYPES_TRANSPORT);
  const eventTypeItemActivity = createEventTypeItems(TYPES_PLACE);
  const destinationOptions = createDestinationOptions(CITIES);
  const eventDetails = createEventDetails(event, offers, description, photo);
  const valueStartDate = formatInDayTime(startDate);
  const valueEndDate = formatInDayTime(endDate);

  const newEventStyle = isNewEvent === null ? `style="display: none"` : ``;

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
              ${eventTypeItemTransfer}

            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${eventTypeItemActivity}

            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${eventName}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="destination" value="${destination}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationOptions}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${valueStartDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${valueEndDate}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
        <input id="event-favorite-${startDate.getTime()}" class="event__favorite-checkbox visually-hidden" type="checkbox" name="favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" ${newEventStyle} for="event-favorite-${startDate.getTime()}">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>
        <button class="event__rollup-btn" ${newEventStyle} type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      ${eventDetails}
    </form>`
  );
};

const checkDestinationValid = (destination) => {
  return CITIES.some((city) => city === destination);
};

const parseOffers = (formData) => {
  const formDataKeys = [];
  formData.forEach((property, key) => formDataKeys.push(key));
  return OFFERS.filter((offer) => {
    return formDataKeys.some((keyForm) => {
      return keyForm === offer.description;
    });
  });
};

const parseFormData = (formData) => {
  return {
    destination: formData.get(`destination`),
    description: ``,
    startDate: getDateObject(formData.get(`event-start-time`)),
    endDate: getDateObject(formData.get(`event-end-time`)),
    price: + formData.get(`price`),
    isFavorite: formData.get(`favorite`) ? true : false,
    offers: parseOffers(formData)
  };
};

export default class EventEdit extends AbstractSmartComponent {
  constructor(event, isNewEvent) {
    super();

    this._event = event;
    this._isNewEvent = isNewEvent;

    this._type = event.type;
    this._offers = event.offers;
    this._destination = event.destination;
    this._description = event.description;
    this._photo = event.photo;
    this._startDate = event.startDate;
    this._endDate = event.endDate;
    this._price = event.price;
    this._isFavorite = event.isFavorite;
    this._flatpickrStart = null;
    this._flatpickrEnd = null;
    this._submitHandler = null;
    this._RollupButtonClickHandler = null;
    this._favoriteInputClickHandler = null;
    this._cancelButtonClickHandler = null;

    this._subscribeOnEvents();
    this._applyFlatpickr();
  }

  getTemplate() {
    return createEventEditTemplate({
      type: this._type,
      offers: this._offers,
      destination: this._destination,
      description: this._description,
      photo: this._photo,
      startDate: this._startDate,
      endDate: this._endDate,
      price: this._price,
      isFavorite: this._isFavorite
    }, this._isNewEvent);
  }

  getData() {
    const form = this.getElement();
    const formData = new FormData(form);
    const result = Object.assign(parseFormData(formData), {
      id: String(new Date() + Math.random()),
      type: this._type,
      description: ``,
      photo: []
    });
    return result;
  }

  setCancelButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._cancelButtonClickHandler = handler;
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setSubmitHandler(this._submitHandler);
    this.setRollupButtonClickHandler(this._RollupButtonClickHandler);
    this.setFavoriteInputClickHandler(this._favoriteInputClickHandler);
    this.setCancelButtonClickHandler(this._cancelButtonClickHandler);
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  reset() {
    this._type = this._event.type;
    this._offers = this._event.offers;
    this._destination = this._event.destination;
    this._description = this._event.description;
    this._photo = this._event.photo;
    this._startDate = this._event.startDate;
    this._endDate = this._event.endDate;
    this._price = this._event.price;
    this.rerender();
  }

  setSubmitHandler(handler) {
    const element = this.getElement();
    this._submitHandler = (evt) => {
      if (!element.querySelector(`.event__save-btn`).value) {
        handler(evt);
      }
    };
    element.addEventListener(`submit`, this._submitHandler);
  }

  setRollupButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, handler);
    this._RollupButtonClickHandler = handler;
  }

  setFavoriteInputClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
    .addEventListener(`click`, handler);
    this._favoriteInputClickHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const saveButton = element.querySelector(`.event__save-btn`);
    const startDateElement = element.querySelector(`input[name="event-start-time"]`);
    const endDateElement = element.querySelector(`input[name="event-end-time"]`);
    const eventInput = element.querySelector(`.event__input--destination`);

    element.querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, (evt) => {
        this._isFavorite = evt.target.checked;
      });

    element.querySelector(`.event__input--price`)
      .addEventListener(`change`, (evt) => {
        this._price = evt.target.value;
      });

    const setButtonDisabled = () => {
      const isEventDestinationValid = checkDestinationValid(eventInput.value);
      const isDateValid = getDateObject(startDateElement.value) < getDateObject(endDateElement.value);
      saveButton.disabled = !isEventDestinationValid || !isDateValid;
    };

    setButtonDisabled();

    startDateElement.addEventListener(`change`, () => {
      setButtonDisabled();
      this._startDate = getDateObject(startDateElement.value);
    });

    endDateElement.addEventListener(`change`, () => {
      setButtonDisabled();
      this._endDate = getDateObject(endDateElement.value);
    });

    const typesList = element.querySelectorAll(`.event__type-input`);
    typesList.forEach((type) => {
      type.addEventListener(`click`, (evt) => {
        this._type = evt.target.value;
        this._offers = generateRandomOffers();
        this.rerender();
      });
    });

    eventInput.addEventListener(`input`, () => {
      setButtonDisabled();
    });

    eventInput.addEventListener(`change`, (evt) => {
      this._destination = evt.target.value;
      this._description = generateRandomDescription();
      this._photo = generateRandomPhotos();
      this.rerender();
    });
  }

  _applyFlatpickr() {
    if (this._flatpickrStart) {
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
    }
    if (this._flatpickrEnd) {
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
    }
    const dateStartElement = this.getElement().querySelector(`input[name="event-start-time"]`);
    this._flatpickrStart = flatpickr(dateStartElement, {
      allowInput: true,
      defaultDate: this._startDate || new Date(),
      enableTime: true,
      dateFormat: `d/m/y H:i`
    });
    const dateEndElement = this.getElement().querySelector(`input[name="event-end-time"]`);
    this._flatpickrEnd = flatpickr(dateEndElement, {
      allowInput: true,
      defaultDate: this._endDate || new Date(),
      enableTime: true,
      dateFormat: `d/m/y H:i`,
    });
  }
}
