import FilterController from './controller/filter.js';
import SiteMenuComponent, {MenuItem} from './components/site-menu.js';
import EventsModel from './models/events.js';
import StatisticsComponent from './components/statistics.js';
import {RenderPosition, render, remove} from './utils/render.js';
import TripController from './controller/trip.js';
import Api from './api/index.js';
import LoadingComponent from './components/loading.js';
import Store from './api/store.js';
import Provaider from './api/provider.js';

const AUTHORIZATION = `Basic kjfslklhVJHlhSREDf8907`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;
const STORE_PREFIX = `trip-localstorage`;
const TAG_NAME = `div`;
const STYLE_ELEMENT = `display: flex; margin: 0 auto 0 auto; font-size: 30px;`;

const Option = {
  EVENTS: `events`,
  DESTINATIONS: `destinations`,
  OFFERS: `offers`
};

const StoreName = {
  EVENTS: `${STORE_PREFIX}-${Option.EVENTS}`,
  DESTINATIONS: `${STORE_PREFIX}-${Option.DESTINATIONS}`,
  OFFERS: `${STORE_PREFIX}-${Option.OFFERS}`
};

const siteHeaderElement = document.querySelector(`.page-header`);
const siteContolsElement = siteHeaderElement.querySelector(`.trip-controls`);
const switchTabsTitleElement = siteContolsElement.querySelector(`h2:last-child`);
const siteMainElement = document.querySelector(`.page-main`);
const bodyContainerElement = siteMainElement.querySelector(`.page-body__container`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);
const newEventButtonElement = siteHeaderElement.querySelector(`.trip-main__event-add-btn`);
const tripMainWrapperElement = siteHeaderElement.querySelector(`.trip-main`);

const onPageClick = (evt) => {
  evt.preventDefault();
  evt.stopPropagation();
};

const onNewEventButtonClick = () => {
  statisticsComponent.hide();
  tripController.show();
  filterController.show();
  tripController.createEvent();
  siteMenuComponent.setActiveItem(MenuItem.TABLE);
};

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(window.localStorage, StoreName.EVENTS, StoreName.DESTINATIONS, StoreName.OFFERS);
const apiWithProvider = new Provaider(api, store);
const eventsModel = new EventsModel();
const siteMenuComponent = new SiteMenuComponent();
const filterController = new FilterController(siteContolsElement, eventsModel);
const tripController = new TripController(tripEventsElement, eventsModel, apiWithProvider, newEventButtonElement, tripMainWrapperElement);
const statisticsComponent = new StatisticsComponent(eventsModel);
const loadingComponent = new LoadingComponent();

newEventButtonElement.disabled = true;
newEventButtonElement.addEventListener(`click`, onNewEventButtonClick);
document.addEventListener(`click`, onPageClick, true);

render(siteContolsElement, siteMenuComponent, RenderPosition.INSERT_BEFORE, switchTabsTitleElement);
filterController.render();
render(tripEventsElement, loadingComponent, RenderPosition.BEFOREEND);
render(bodyContainerElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

siteMenuComponent.setChangeHandler((menuItem) => {
  siteMenuComponent.setActiveItem(menuItem);
  switch (menuItem) {
    case MenuItem.TABLE:
      statisticsComponent.hide();
      tripController.show();
      filterController.show();
      break;
    case MenuItem.STATISTICS:
      tripController.hide();
      statisticsComponent.show();
      filterController.hide();
      break;
  }
});

apiWithProvider.getEvents()
  .then((events) => {
    eventsModel.setEvents(events);
  })
  .then(() => {
    return apiWithProvider.getDestinations()
      .then((destinations) => {
        eventsModel.setDestinations(destinations);
      });
  })
  .then(() => {
    return apiWithProvider.getOffers()
      .then((offers) => {
        eventsModel.setOffers(offers);
      });
  })
  .then(() => {
    remove(loadingComponent);
    tripController.render();
    document.removeEventListener(`click`, onPageClick, true);
  });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.sync()
      .then((synchronizedEvents) => {
        eventsModel.updateEvents(synchronizedEvents);
      })
      .catch((error) => {
        const errorElement = document.createElement(TAG_NAME);
        errorElement.style = STYLE_ELEMENT;
        errorElement.textContent = `Ошибка загрузки приложения ${error.message}`;
        siteMainElement.prepend(errorElement);
      });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

if (!window.navigator.onLine) {
  document.title += ` [offline]`;
}
