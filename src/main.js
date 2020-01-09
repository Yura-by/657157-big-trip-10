import FilterController from './controller/filter.js';
import SiteMenuComponent, {MenuItem} from './components/site-menu.js';
import EventsModel from './models/events.js';
import StatisticsComponent from './components/statistics.js';
import {RenderPosition, render, remove} from './utils/render.js';
import TripController from './controller/trip.js';
import Api from './api.js';
import LoadingComponent from './components/loading.js';

const AUTHORIZATION = `Basic kjfslklhVJHlhSREDf8907`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);
const eventsModel = new EventsModel();

const siteHeaderElement = document.querySelector(`.page-header`);
const siteContolsElement = siteHeaderElement.querySelector(`.trip-controls`);
const switchTabsTitleElement = siteContolsElement.querySelector(`h2:last-child`);
const siteMainElement = document.querySelector(`.page-main`);
const bodyContainerElement = siteMainElement.querySelector(`.page-body__container`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

const siteMenuComponent = new SiteMenuComponent();
const filterController = new FilterController(siteContolsElement, eventsModel);
const tripController = new TripController(tripEventsElement, eventsModel, api);
const statisticsComponent = new StatisticsComponent(eventsModel);
const loadingComponent = new LoadingComponent();

render(siteContolsElement, siteMenuComponent, RenderPosition.INSERT_BEFORE, switchTabsTitleElement);
filterController.render();
render(tripEventsElement, loadingComponent, RenderPosition.BEFOREEND);
render(bodyContainerElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

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

api.getEvents()
  .then((events) => {
    eventsModel.setEvents(events);
  })
  .then(() => {
    return api.getDestinations()
      .then((destinations) => {
        eventsModel.setDestinations(destinations);
      });
  })
  .then(() => {
    return api.getOffers()
      .then((offers) => {
        eventsModel.setOffers(offers);
      });
  })
  .then(() => {
    remove(loadingComponent);
    tripController.render();
  });

/* const getTotalPrice = () => {
  return events.reduce((total, event) => {
    const {price, offers} = event;
    const resultOffres = offers.reduce((amount, offer) => {
      return amount + offer.add;
    }, 0);

    return total + price + resultOffres;
  }, 0);
};

siteHeaderElement.querySelector(`.trip-info__cost-value`).textContent = getTotalPrice(); */
