import AbstractComponent from './abstract-component.js';

const getTripDescriptionTemplate = (title, date) => {
  return title ?
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>
      <p class="trip-info__dates">${date}</p>
    </div>` : ` `;
};

const createInfoTemplate = (title, date, totalPrice = 0) => {
  const tripDescription = getTripDescriptionTemplate(title, date);
  return (
    `<section class="trip-main__trip-info  trip-info">
      ${tripDescription}
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`);
};

export default class TripInfo extends AbstractComponent {
  constructor(content, totalPrice) {
    const {title, date} = content;
    super();
    this._title = title;
    this._date = date;
    this._totalPrice = totalPrice;
  }

  getTemplate() {
    return createInfoTemplate(this._title, this._date, this._totalPrice);
  }
}


