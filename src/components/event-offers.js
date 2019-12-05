import {createElement} from '../util.js';

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
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${idName}" type="checkbox" name="event-offer-luggage" checked>
        <label class="event__offer-label" for="event-offer-${idName}">
          <span class="event__offer-title">${description}</span>
          &plus;
          ${currency}&nbsp;<span class="event__offer-price">${add}</span>
        </label>
      </div>`
    );
  }).join(`\n`);
};

const createEventOffersTemplate = (event) => {
  const {offers} = event;
  const offerSelectors = offers.length > 0 ? createSelectors(offers) : ``;
  return offers.length > 0 ? (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offerSelectors}
      </div>
    </section>`
  )
    : ``;
};

export default class EventOffers {
  constructor(event) {
    this._event = event;
    this._element = null;
  }

  getTemplate() {
    return createEventOffersTemplate(this._event);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
