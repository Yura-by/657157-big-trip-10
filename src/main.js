import DaysComponent from './components/days.js';
import EventDetailsComponent from './components/event-details.js';
import EventEditComponent from './components/event-edit.js';
import EventComponent from './components/event.js';
import SiteFilterComponent from './components/site-filter.js';
import SiteMenuComponent from './components/site-menu.js';
import SortComponent from './components/sort.js';
import EventOffersComponent from './components/event-offers.js';
import EventDestinationComponent from './components/event-destination.js';
import NoEvents from './components/no-events.js';
import {generateEvents} from './mock/event.js';
import {generateMenu} from './mock/menu.js';
import {generateFilter} from './mock/filter.js';
import {generateSort} from './mock/sort.js';
import {castTimeFormat} from './utils/common.js';
import {RenderPosition, render, remove, replace} from './utils/render.js';

const EVENT_COUNT = 4;

const siteHeaderElement = document.querySelector(`.page-header`);
const siteContolsElement = siteHeaderElement.querySelector(`.trip-controls`);
const switchTabsTitleElement = siteContolsElement.querySelector(`h2:last-child`);
const siteMainElement = document.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

const events = generateEvents(EVENT_COUNT);

render(siteContolsElement, new SiteMenuComponent(generateMenu()), RenderPosition.INSERT_BEFORE, switchTabsTitleElement);
render(siteContolsElement, new SiteFilterComponent(generateFilter()), RenderPosition.BEFOREEND);

const renderEvent = (event, day) => {

  const escKeydownHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      replaceEventToEdit();
      document.removeEventListener(`keydown`, escKeydownHandler);
    }
  };

  const eventComponent = new EventComponent(event);
  const editButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, () => {
    replaceEditToEvent();
    document.addEventListener(`keydown`, escKeydownHandler);
  });
  const replaceEditToEvent = () => {
    day.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const eventEditComponent = new EventEditComponent(event);
  const editForm = eventEditComponent.getElement();
  editForm.addEventListener(`submit`, () => {
    replaceEventToEdit();
  });
  const replaceEventToEdit = () => {
    day.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  const eventDetailsComponent = new EventDetailsComponent();

  render(eventEditComponent.getElement(), eventDetailsComponent, RenderPosition.BEFOREEND);
  render(eventDetailsComponent.getElement(), new EventOffersComponent(event), RenderPosition.BEFOREEND);
  render(eventDetailsComponent.getElement(), new EventDestinationComponent(event), RenderPosition.BEFOREEND);

  render(day, eventComponent, RenderPosition.BEFOREEND);
};

const renderTrip = (tripElement, events) => {
  if (!events || events.length === 0) {
    render(tripElement, new NoEvents(), RenderPosition.BEFOREEND);
    return;
  }

  render(tripElement, new SortComponent(generateSort()), RenderPosition.BEFOREEND);

  const eventsSorted = events.sort((eventBefore, eventAfter) => eventBefore.startDate.getTime() - eventAfter.startDate.getTime());

  const daysEventAll = eventsSorted.map((event) => {
    const {startDate} = event;
    return (
      `${castTimeFormat(startDate.getDate())}${castTimeFormat(startDate.getMonth())}${castTimeFormat(startDate.getFullYear())}`
    );
  });

  const daysEventInSet = new Set(daysEventAll);

  const createArrayEventsByDay = (day, array) => {

    return array.filter((event) => castTimeFormat(event.startDate.getDate()) === `${day[0] + day[1]}` &&
      castTimeFormat(event.startDate.getMonth()) === `${day[2] + day[3]}` &&
      castTimeFormat(event.startDate.getFullYear()) === `${day[4] + day[5] + day[6] + day[7]}`);
  };

  const daysEventInArray = Array.from(daysEventInSet);

  const daysWithEvents = daysEventInArray.map((day) => createArrayEventsByDay(day, eventsSorted));
  render(tripElement, new DaysComponent(daysWithEvents), RenderPosition.BEFOREEND);

  const eventsListElements = tripElement.querySelectorAll(`.trip-events__list`);

  eventsListElements.forEach((day, indexDay) => {
    daysWithEvents[indexDay].forEach((event, eventIndex) => {
      renderEvent(daysWithEvents[indexDay][eventIndex], day);
    }
    );
  });
};

renderTrip(tripEventsElement, events);

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
