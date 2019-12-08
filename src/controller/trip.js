import DaysComponent from '../components/days.js';
import EventDetailsComponent from '../components/event-details.js';
import EventEditComponent from '../components/event-edit.js';
import EventComponent from '../components/event.js';
import SortComponent from '../components/sort.js';
import EventOffersComponent from '../components/event-offers.js';
import EventDestinationComponent from '../components/event-destination.js';
import NoEventsComponent from '../components/no-events.js';
import {generateSort} from '../mock/sort.js';
import {castTimeFormat} from '../utils/common.js';
import {RenderPosition, render, remove, replace} from '../utils/render.js';

const renderEvent = (event, day) => {

  const escKeydownHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      replaceEventToEdit();
      document.removeEventListener(`keydown`, escKeydownHandler);
    }
  };

  const replaceEditToEvent = () => {
    replace(eventEditComponent, eventComponent);
  };

  const replaceEventToEdit = () => {
    replace(eventComponent, eventEditComponent);
  };

  const eventComponent = new EventComponent(event);

  eventComponent.setRollupButtonClickHandler(() => {
    replaceEditToEvent();
    document.addEventListener(`keydown`, escKeydownHandler);
  });

  const eventEditComponent = new EventEditComponent(event);

  eventEditComponent.setSubmitHandler(() => {
    replaceEventToEdit();
  });

  const eventDetailsComponent = new EventDetailsComponent();

  render(eventEditComponent.getElement(), eventDetailsComponent, RenderPosition.BEFOREEND);
  render(eventDetailsComponent.getElement(), new EventOffersComponent(event), RenderPosition.BEFOREEND);
  render(eventDetailsComponent.getElement(), new EventDestinationComponent(event), RenderPosition.BEFOREEND);

  render(day, eventComponent, RenderPosition.BEFOREEND);
};

const renderTrip = (tripElement, events) => {
  if (!events || events.length === 0) {
    render(tripElement, new NoEventsComponent(), RenderPosition.BEFOREEND);
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

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent(generateSort());
  }

  render(events) {
    if (!events || events.length === 0) {
      render(tripElement, new NoEventsComponent(), RenderPosition.BEFOREEND);
      return;
    }
  }
}
