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

export const createSortTemplate = (list) => {
  const sortItems = list.length > 0 ? createSorts(list) : ``;

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${sortItems}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};
