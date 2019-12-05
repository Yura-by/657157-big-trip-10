import {createElement} from '../util.js';

const createFilters = (filters) => {
  return filters.
  map((filter) => {
    return (
      `<div class="trip-filters__filter">
        <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything">
        <label class="trip-filters__filter-label" for="filter-everything">${filter}</label>
      </div>`
    );
  }).join(`\n`);
};

const createSiteFilterTemplate = (filters) => {
  const filterItems = filters.length > 0 ? createFilters(filters) : ``;
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItems}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class SiteFilter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createSiteFilterTemplate(this._filters);
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
