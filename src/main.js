import FilterController from './controller/filter.js';
import SiteMenuComponent, {MenuItem} from './components/site-menu.js';
import EventsModel from './models/events.js';
import StatisticsComponent from './components/statistics.js';
import {generateEvents} from './mock/event.js';
import {RenderPosition, render} from './utils/render.js';
import TripController from './controller/trip.js';

const EVENT_COUNT = 22;

const siteHeaderElement = document.querySelector(`.page-header`);
const siteContolsElement = siteHeaderElement.querySelector(`.trip-controls`);
const switchTabsTitleElement = siteContolsElement.querySelector(`h2:last-child`);
const siteMainElement = document.querySelector(`.page-main`);
const bodyContainerElement = siteMainElement.querySelector(`.page-body__container`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

const events = generateEvents(EVENT_COUNT);
const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const siteMenuComponent = new SiteMenuComponent();

render(siteContolsElement, siteMenuComponent, RenderPosition.INSERT_BEFORE, switchTabsTitleElement);

const filterController = new FilterController(siteContolsElement, eventsModel);
filterController.render();

const tripController = new TripController(tripEventsElement, eventsModel);

tripController.render();

const statisticsComponent = new StatisticsComponent(eventsModel);

render(bodyContainerElement, statisticsComponent, RenderPosition.BEFOREEND);

siteMenuComponent.setOnChange((menuItem) => {
  siteMenuComponent.setActiveItem(menuItem);
  switch (menuItem) {
    case MenuItem.TABLE:
      statisticsComponent.hide();
      tripController.show();
      break;
    case MenuItem.STATISTICS:
      tripController.hide();
      statisticsComponent.show();
      break;
  }
});

const onAddEventClick = () => {
    statisticsComponent.hide();
    tripController.show();
    tripController.createEvent();
    siteMenuComponent.setActiveItem(MenuItem.TABLE);
  };

siteHeaderElement.querySelector(`.trip-main__event-add-btn`)
  .addEventListener(`click`, onAddEventClick);

statisticsComponent.hide();

const getTotalPrice = () => {
  return events.reduce((total, event) => {
    const {price, offers} = event;
    const resultOffres = offers.reduce((amount, offer) => {
      return amount + offer.add;
    }, 0);

    return total + price + resultOffres;
  }, 0);
};

siteHeaderElement.querySelector(`.trip-info__cost-value`).textContent = getTotalPrice();
