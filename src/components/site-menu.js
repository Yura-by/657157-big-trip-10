import AbstractComponent from './abstract-component.js';

const ACTIVE_CLASS = `trip-tabs__btn--active`;
const TAG_NAME = `A`;

const MenuItem = {
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
    const itemsMenu = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    itemsMenu.forEach((point) => {
      if (point.classList.contains(ACTIVE_CLASS)) {
        point.classList.remove(ACTIVE_CLASS);
      }
      if (point.text === menuItem) {
        point.classList.add(ACTIVE_CLASS);
      }
    });
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== TAG_NAME) {
        return;
      }
      const menuItem = evt.target.text;

      handler(menuItem);
    });
  }
}

export {MenuItem};
