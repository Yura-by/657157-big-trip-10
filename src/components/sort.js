import AbstractComponent from './abstract-component.js';

const createSorts = (sorts) => {
  return sorts.
  map((sort) => {

    return (
      `<div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort}" checked>
        <label class="trip-sort__btn" for="sort-${sort}">${sort}</label>
      </div>`
    );
  }).join(`\n`);
};

const createSortTemplate = (sorts) => {
  const sortItems = sorts.length > 0 ? createSorts(sorts) : ``;

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${sortItems}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractComponent {
  constructor(sorts) {
    super();
    this._sorts = sorts;
  }

  getTemplate() {
    return createSortTemplate(this._sorts);
  }
}
