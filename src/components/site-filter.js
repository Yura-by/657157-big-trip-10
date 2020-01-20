import AbstractComponent from './abstract-component.js';

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createFilterMarkup = (filter, isChecked) => {
  const {name} = filter;

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" ${isChecked ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
    </div>`
  );
};

const createSiteFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((filter) => createFilterMarkup(filter, filter.checked)).join(`\n`);
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
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

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }

  setFilterDisabled(name) {
    const inputElement = this.getElement().querySelector(`#${FILTER_ID_PREFIX}${name}`);
    inputElement.disabled = true;
    const labelSelector = `label[for="${FILTER_ID_PREFIX}${name}"]`;
    const labelElement = this.getElement().querySelector(`${labelSelector}`);
    labelElement.classList.add(`trip-filter-blocked`);
  }

  setFiltersUndisabled() {
    const filtersElements = this.getElement().querySelectorAll(`.trip-filters__filter-input`);
    filtersElements.forEach((item) => {
      item.disabled = false;
    });
    const labelsElements = this.getElement().querySelectorAll(`.trip-filters__filter-label`);
    labelsElements.forEach((item) => {
      if (item.classList.contains(`trip-filter-blocked`)) {
        item.classList.remove(`trip-filter-blocked`);
      }
    });
  }
}
