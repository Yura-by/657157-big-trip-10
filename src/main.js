import DaysComponent from './components/days.js';
import EventDetailsComponent from './components/event-details.js';
import EventEditComponent from './components/event-edit.js';
import EventComponent from './components/event.js';
import SiteFilterComponent from './components/site-filter.js';
import SiteMenuComponent from './components/site-menu.js';
import SortComponent from './components/sort.js';
import EventOffersComponent from './components/event-offers.js';
import EventDestinationComponent from './components/event-destination.js';
import {generateEvents} from './mock/event.js';
import {generateMenu} from './mock/menu.js';
import {generateFilter} from './mock/filter.js';
import {generateSort} from './mock/sort.js';
import {castTimeFormat, RenderPosition, render} from './util.js';

const EVENT_COUNT = 4;

const siteHeaderElement = document.querySelector(`.page-header`);
const siteContolsElement = siteHeaderElement.querySelector(`.trip-controls`);
const switchTabsTitleElement = siteContolsElement.querySelector(`h2:last-child`);
const siteMainElement = document.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

const events = generateEvents(EVENT_COUNT);

render(siteContolsElement, new SiteMenuComponent(generateMenu()).getElement(), RenderPosition.INSERT_BEFORE, switchTabsTitleElement);
render(siteContolsElement, new SiteFilterComponent(generateFilter()).getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, new SortComponent(generateSort()).getElement(), RenderPosition.BEFOREEND);

const evenstsSorted = events.sort((eventBefore, eventAfter) => eventBefore.startDate.getTime() - eventAfter.startDate.getTime());

const daysEventAll = evenstsSorted.map((event) => {
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

const daysWithEvents = daysEventInArray.map((day) => createArrayEventsByDay(day, evenstsSorted));
render(tripEventsElement, new DaysComponent(daysWithEvents).getElement(), RenderPosition.BEFOREEND);

const createEvent = (event, day) => {
  const eventComponent = new EventComponent(event);
  const eventEditComponent = new EventEditComponent(event);

  const editButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, () => {
    day.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  });

  const editForm = eventEditComponent.getElement();
  editForm.addEventListener(`submit`, () => {
    day.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  });

  const eventDetailsComponent = new EventDetailsComponent();

  render(eventEditComponent.getElement(), eventDetailsComponent.getElement(), RenderPosition.BEFOREEND);
  render(eventDetailsComponent.getElement(), new EventOffersComponent(event).getElement(), RenderPosition.BEFOREEND);
  render(eventDetailsComponent.getElement(), new EventDestinationComponent(event).getElement(), RenderPosition.BEFOREEND);

  return eventComponent.getElement();
};

const eventsListElements = tripEventsElement.querySelectorAll(`.trip-events__list`);

eventsListElements.forEach((day, indexDay) => {
  daysWithEvents[indexDay].forEach((event, eventIndex) => {
    render(day, createEvent(daysWithEvents[indexDay][eventIndex], day), RenderPosition.BEFOREEND);
  }
  );
});

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
