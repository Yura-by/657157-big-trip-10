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

const Option = {
  EVENTS: `events`,
  DESTINATIONS: `destinations`,
  OFFERS: `offers`
};

const StoreName = {
  EVENTS: `${STORE_PREFIX}-${Option.EVENTS}`,
  DESTINATIONS: `${STORE_PREFIX}-${Option.DESTINATIONS}`,
  OFFERS: `${STORE_PREFIX}-${Option.OFFERS}`
}

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
    }).catch(() => {
      // Действие, в случае ошибки при регистрации ServiceWorker
    });
});

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(window.localStorage, StoreName.EVENTS, StoreName.DESTINATIONS, StoreName.OFFERS);
const apiWithProvider = new Provaider(api, store);

const eventsModel = new EventsModel();

const siteHeaderElement = document.querySelector(`.page-header`);
const siteContolsElement = siteHeaderElement.querySelector(`.trip-controls`);
const switchTabsTitleElement = siteContolsElement.querySelector(`h2:last-child`);
const siteMainElement = document.querySelector(`.page-main`);
const bodyContainerElement = siteMainElement.querySelector(`.page-body__container`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

const onAddEventClick = () => {
  statisticsComponent.hide();
  tripController.show();
  tripController.createEvent();
  siteMenuComponent.setActiveItem(MenuItem.TABLE);
};

const newEventButton = siteHeaderElement.querySelector(`.trip-main__event-add-btn`);
newEventButton.disabled = true;
newEventButton.addEventListener(`click`, onAddEventClick);

const siteMenuComponent = new SiteMenuComponent();
const filterController = new FilterController(siteContolsElement, eventsModel);
const tripController = new TripController(tripEventsElement, eventsModel, apiWithProvider, newEventButton);
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
  });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.sync()
      .then(() => {
        // Действие, в случае успешной синхронизации
      })
      .catch(() => {
        // Действие, в случае ошибки синхронизации
      });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
