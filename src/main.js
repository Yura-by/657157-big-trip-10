import SiteFilterComponent from './components/site-filter.js';
import SiteMenuComponent from './components/site-menu.js';
import {generateEvents} from './mock/event.js';
import {generateMenu} from './mock/menu.js';
import {generateFilter} from './mock/filter.js';
import {RenderPosition, render} from './utils/render.js';
import TripController from './controller/trip.js';

const EVENT_COUNT = 4;

const siteHeaderElement = document.querySelector(`.page-header`);
const siteContolsElement = siteHeaderElement.querySelector(`.trip-controls`);
const switchTabsTitleElement = siteContolsElement.querySelector(`h2:last-child`);
const siteMainElement = document.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

const events = generateEvents(EVENT_COUNT);

render(siteContolsElement, new SiteMenuComponent(generateMenu()), RenderPosition.INSERT_BEFORE, switchTabsTitleElement);
render(siteContolsElement, new SiteFilterComponent(generateFilter()), RenderPosition.BEFOREEND);

const tripController = new TripController(tripEventsElement);

tripController.render(events);

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
