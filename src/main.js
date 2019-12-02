import {createDayTemplate} from './components/day.js';
import {createDaysTemplate} from './components/days.js';
import {createEventDetailsTemplate} from './components/event-details.js';
import {createEventEditTemplate} from './components/event-edit.js';
import {createEventTemplate} from './components/event.js';
import {createSiteFilterTemplate} from './components/site-filter.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createSortTemplate} from './components/sort.js';
import {createEventOffersTemplate} from './components/event-offers.js';
import {createEventDestionationTemplate} from './components/event-destination.js';
import {generateEvents} from './mock/event.js';
import {generateMenu} from './mock/menu.js';
import {generateFilter} from './mock/filter.js';
import {generateSort} from './mock/sort.js';
import {castTimeFormat} from './util.js';

const EVENT_COUNT = 4;

const siteHeaderElement = document.querySelector(`.page-header`);
const siteContolsElement = siteHeaderElement.querySelector(`.trip-controls`);
const switchTabsTitleElement = siteContolsElement.querySelector(`h2`);
const siteMainElement = document.querySelector(`.page-main`);
const tripEventsElement = siteMainElement.querySelector(`.trip-events`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const events = generateEvents(EVENT_COUNT);

render(switchTabsTitleElement, createSiteMenuTemplate(generateMenu()), `afterend`);
render(siteContolsElement, createSiteFilterTemplate(generateFilter()), `beforeend`);
render(tripEventsElement, createSortTemplate(generateSort()), `beforeend`);
render(tripEventsElement, createEventEditTemplate(events[0]), `beforeend`);

const eventEditElement = tripEventsElement.querySelector(`.event--edit`);

render(eventEditElement, createEventDetailsTemplate(), `beforeend`);

const eventDetailsElement = tripEventsElement.querySelector(`.event__details`);

render(eventDetailsElement, createEventOffersTemplate(events[0]), `beforeend`);
render(eventDetailsElement, createEventDestionationTemplate(events[0]), `beforeend`);

const evenstsSorted = events.slice(1, events.length)
  .sort((eventBefore, eventAfter) => eventBefore.startDate.getTime() - eventAfter.startDate.getTime());

const daysEventAll = evenstsSorted.map((event) => {
  const {startDate} = event;
  return (
  `${castTimeFormat(startDate.getDate())}${castTimeFormat(startDate.getMonth())}${castTimeFormat(startDate.getFullYear())}`
  )
});

const daysEventInSet = new Set(daysEventAll);

const createArrayEventsByDay = (day, array) => {
  return array.filter((event) => castTimeFormat(event.startDate.getDate()) === `${day[0]+day[1]}` &&
    castTimeFormat(event.startDate.getMonth()) === `${day[2]+day[3]}` &&
    castTimeFormat(event.startDate.getFullYear()) === `${day[4]+day[5]+day[6]+day[7]}`);
};

const daysEventInArray = Array.from(daysEventInSet);

const daysWithEvents = daysEventInArray.map((day) => createArrayEventsByDay(day, evenstsSorted));

render(tripEventsElement, createDaysTemplate(), `beforeend`);

const tripDaysElement = tripEventsElement.querySelector(`.trip-days`);

render(tripDaysElement, createDayTemplate(daysWithEvents), `beforeend`);

const eventsListElements = tripDaysElement.querySelectorAll(`.trip-events__list`);

eventsListElements.forEach((day, indexDay) => {
  daysWithEvents[indexDay].forEach((event, eventIndex) => {
    render(day, createEventTemplate(daysWithEvents[indexDay][eventIndex]), `beforeend`)}
    );
});

