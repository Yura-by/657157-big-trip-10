import {createElement} from '../util.js';

const createLinks = (points) => {
  return points.
  map((linkName) => {
    let name = linkName;
    name = linkName[0].toUpperCase() + name.slice(1);
    return (
      `<a class="trip-tabs__btn" href="#">${name}</a>`
    );
  }).join(`\n`);
};

const createSiteMenuTemplate = (points) => {
  const linksItems = points.length > 0 ? createLinks(points) : ``;
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${linksItems}
    </nav>`
  );
};

export default class SiteMenu {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._points);
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
