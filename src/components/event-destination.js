import {createElement} from '../util.js';

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

const createEventDestionationTemplate = (event) => {
  const {description, photo} = event;
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

export default class EventDestination {
  constructor(event) {
    this._event = event;
    this._element = null;
  }

  getTemplate() {
    return createEventDestionationTemplate(this._event);
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
