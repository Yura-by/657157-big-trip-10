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

console.log(events);

render(switchTabsTitleElement, createSiteMenuTemplate(), `afterend`);
render(siteContolsElement, createSiteFilterTemplate(), `beforeend`);
render(tripEventsElement, createSortTemplate(), `beforeend`);
render(tripEventsElement, createEventEditTemplate(events[0]), `beforeend`);

const eventEditElement = tripEventsElement.querySelector(`.event--edit`);

render(eventEditElement, createEventDetailsTemplate(), `beforeend`);

const eventDetailsElement = tripEventsElement.querySelector(`.event__details`);

render(eventDetailsElement, createEventOffersTemplate(), `beforeend`);
render(eventDetailsElement, createEventDestionationTemplate(), `beforeend`);

render(tripEventsElement, createDaysTemplate(), `beforeend`);

const tripDaysElement = tripEventsElement.querySelector(`.trip-days`);

render(tripDaysElement, createDayTemplate(), `beforeend`);

const eventsListElement = tripDaysElement.querySelector(`.trip-events__list`);

events.slice(1, events.length).forEach((event) => render(eventsListElement, createEventTemplate(event), `beforeend`));
