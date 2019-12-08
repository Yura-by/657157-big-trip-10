import AbstractComponent from './abstract-component.js';

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

export default class SiteFilter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createSiteFilterTemplate(this._filters);
  }
}
