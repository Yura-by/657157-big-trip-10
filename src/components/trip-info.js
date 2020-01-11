import AbstractComponent from './abstract-component.js';

const createInfoTemplate = (title, date) => {
  return title ?
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>
      <p class="trip-info__dates">${date}</p>
    </div>` : ` `;
};

export default class TripInfo extends AbstractComponent {
  constructor(content) {
    const {title, date} = content;
    super();
    this._title = title;
    this._date = date;
  }

  getTemplate() {
    return createInfoTemplate(this._title, this._date);
  }
}
