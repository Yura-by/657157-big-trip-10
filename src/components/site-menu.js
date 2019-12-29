import AbstractComponent from './abstract-component.js';

const ACTIVE_CLASS = `trip-tabs__btn--active`;

export const MenuItem = {
  STATISTICS: `Stats`,
  TABLE: `Table`
};

const createSiteMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {
  getTemplate() {
    return createSiteMenuTemplate();
  }

  setActiveItem(menuItem) {
    const items = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    items.forEach((item) => {
      if (item.classList.contains(ACTIVE_CLASS)) {
        item.classList.remove(ACTIVE_CLASS);
      }
      if (item.text === menuItem) {
        item.classList.add(ACTIVE_CLASS);
      }
    });
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      const menuItem = evt.target.text;

      handler(menuItem);
    });
  }
}
