import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import {TYPES_TRANSPORT, TYPES_PLACE, Type, Index} from '../const.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import {getDateObject, formatInDayTime, getDestinationTitle} from '../utils/common.js';

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

const TYPE_CHECK = `check`;

const createSelectors = (offers) => {
  return offers.
  map((offer, count) => {
    const {title, price, isChecked} = offer;
    const idName = `${title}-${count}`;
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${idName}" type="checkbox" name="${title}" ${isChecked ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${idName}">
          <span class="event__offer-title">${title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  }).join(`\n`);
};

const getCheckedOffer = (offerByType, offers) => {
  return offers.some((item) => {
    return item[`title`] === offerByType[`title`];
  });
};

const getPriceOffer = (offerByType, offers) => {
  const offer = offers.find((item) => item.title === offerByType.title);
  const resultPrice = offer ? offer.price : offerByType.price;
  return resultPrice;
};

export const getOffersByType = (type, allOffers) => {
  return allOffers.filter((item) => item[`type`] === type)[0].offers;
};

const getOffers = (type, allOffers, currentOffers) => {
  const offersByType = getOffersByType(type, allOffers);
  const offersResult = offersByType.map((offerByType) => {
    const {title} = offerByType;
    return {
      title,
      price: getPriceOffer(offerByType, currentOffers),
      isChecked: getCheckedOffer(offerByType, currentOffers)
    };
  });
  return offersResult;
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

const createEventTypeItems = (types, currentType) => {
  return types.map((type) => {
    const isChecked = type === currentType;
    let typeName = type;
    if (type === Type.CHECK) {
      typeName = TYPE_CHECK;
    }
    typeName = typeName[Index.UPPERCASE_LETTER].toUpperCase() + typeName.slice(Index.DRAIN_LETTER);
    return (
      `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="type" value="${type}" ${isChecked ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${typeName}</label>
      </div>`
    );
  }).join(`\n`);
};

const createDestinationOptions = (allDestinations) => {
  return allDestinations.map((destination) => {
    return (
      `<option value="${destination[`name`]}"></option>`
    );
  }).join(`\n`);
};

const createImagesItems = (pictures) => {
  return pictures.
  map((soursePhoto) => {
    const {description, src} = soursePhoto;
    return (
      `<img class="event__photo" src="${src}" alt="${description}">`
    );
  }).join(`\n`);
};

const createImagesTemplate = (pictures) => {
  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${createImagesItems(pictures)}
      </div>
    </div>`
  );
};

const createEventDescriptionTemplate = (destination) => {
  const {description, pictures} = destination;
  const descriptionImages = pictures.length > 0 ? createImagesTemplate(destination.pictures) : ``;
  return description.length > 0 || pictures.length > 0 ? (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      ${descriptionImages}
    </section>`
  )
    : ` `;
};

const createEventDetails = (offers, destination) => {
  const offersTemplate = createEventOffersTemplate(offers);
  const descriptionTemplate = createEventDescriptionTemplate(destination);
  const {description, pictures} = destination;
  const detailsTemplate = offers.length > 0 ||
    description.length > 0 ||
    pictures.length > 0 ?
    `<section class="event__details">${offersTemplate} ${descriptionTemplate}</section>` : ``;
  return detailsTemplate;
};

const getCheckedOffers = (allOffers) => {
  const fullOffers = allOffers.filter((offer) => offer.isChecked);
  return fullOffers.map((offer) => {
    const {title, price} = offer;
    return {
      title,
      price
    };
  });
};

const createEventEditTemplate = (options = {}, isNewEvent) => {
  const {allDestinations, type, offers, destination, startDate, endDate, price, isFavorite, externalData} = options;

  const nameImage = type;

  const eventName = getDestinationTitle(type);
  const destinationName = destination[`name`];

  const eventTypeItemTransfer = createEventTypeItems(TYPES_TRANSPORT, type);
  const eventTypeItemActivity = createEventTypeItems(TYPES_PLACE, type);
  const destinationOptions = allDestinations.length > 0 ? createDestinationOptions(allDestinations, destination) : ``;
  const valueStartDate = formatInDayTime(startDate);
  const valueEndDate = formatInDayTime(endDate);
  const eventDetails = createEventDetails(offers, destination, type);

  const newEventStyle = isNewEvent === null ? `style="display: none"` : ``;

  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="destination" value="${destinationName}" list="destination-list-1">
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
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="price" value="${price}" required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
        <button class="event__reset-btn" type="reset">${deleteButtonText}</button>
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

const checkDestinationValid = (destination, allDestinations) => {
  return allDestinations.some((city) => city[`name`] === destination);
};

export default class EventEdit extends AbstractSmartComponent {
  constructor(event, isNewEvent, allDestinations, allOffers) {
    super();

    this._event = event;
    this._isNewEvent = isNewEvent;
    this._allDestinations = allDestinations;
    this._allOffers = allOffers;

    this._type = event.type;
    this._offers = getOffers(event.type, allOffers, event.offers);
    this._destination = event.destination;
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
    this._externalData = DefaultData;
    this._isSendingForm = false;

    this._subscribeOnEvents();
    this._applyFlatpickr();
  }

  getTemplate() {
    return createEventEditTemplate({
      allDestinations: this._allDestinations,
      type: this._type,
      offers: this._offers,
      destination: this._destination,
      startDate: this._startDate,
      endDate: this._endDate,
      price: this._price,
      isFavorite: this._isFavorite,
      externalData: this._externalData
    }, this._isNewEvent);
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  getSandingState() {
    return this._isSendingForm;
  }

  setDisabledState() {
    this._isSendingForm = true;
    this.getElement().querySelector(`.event__save-btn`).disabled = true;
    this.getElement().querySelector(`.event__favorite-checkbox`).disabled = true;
    this.getElement().querySelector(`.event__reset-btn`).disabled = true;
  }

  getData() {
    const form = this.getElement();
    const offers = getCheckedOffers(this._offers);
    return {
      formData: new FormData(form),
      type: this._type,
      offers
    };
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

  rerender(newEvent) {
    if (newEvent) {
      this._isFavorite = newEvent.isFavorite;
    }
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
    this._offers = getOffers(this._event.type, this._allOffers, this._event.offers);
    this._destination = this._event.destination;
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
    .addEventListener(`click`, (evt) => {
      handler(evt, this._isFavorite);
    });
    this._favoriteInputClickHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const saveButton = element.querySelector(`.event__save-btn`);
    const startDateElement = element.querySelector(`input[name="event-start-time"]`);
    const endDateElement = element.querySelector(`input[name="event-end-time"]`);
    const eventInput = element.querySelector(`.event__input--destination`);
    const offersCheckboxes = element.querySelectorAll(`.event__offer-checkbox`);
    const priceInput = element.querySelector(`.event__input--price`);

    offersCheckboxes.forEach((item) => {
      item.addEventListener(`change`, (evt) => {
        const targetOffer = this._offers.find((offer) => offer.title === evt.target.name);
        targetOffer.isChecked = !targetOffer.isChecked;
      });
    });

    priceInput.addEventListener(`change`, (evt) => {
      this._price = evt.target.value;
      setButtonDisabled();
    });

    const setButtonDisabled = () => {
      const isEventDestinationValid = checkDestinationValid(eventInput.value, this._allDestinations);
      const isDateValid = getDateObject(startDateElement.value) < getDateObject(endDateElement.value);
      const priceNumber = parseInt(this._price, 10);
      const isPriceValid = priceNumber || priceNumber === 0 ? true : false;
      saveButton.disabled = !isEventDestinationValid || !isDateValid || !isPriceValid;
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
        if (this._event.type === evt.target.value) {
          this._offers = getOffers(this._event.type, this._allOffers, this._event.offers);
          this._offers.forEach((offer) => {
            offer.isChecked = false;
          });
        } else {
          this._offers = getOffers(this._type, this._allOffers, this._event.offers);
        }
        this.rerender();
      });
    });

    eventInput.addEventListener(`change`, () => {
      setButtonDisabled();
    });

    eventInput.addEventListener(`change`, (evt) => {
      const target = this._allDestinations.find((item) => item[`name`] === evt.target.value);
      if (target) {
        this._destination = target;
      } else {
        this._destination = {
          name: evt.target.value,
          pictures: [],
          description: ``
        };
      }
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
