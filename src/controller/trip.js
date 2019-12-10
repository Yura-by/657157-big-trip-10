import DaysComponent from '../components/days.js';
import EventDetailsComponent from '../components/event-details.js';
import EventEditComponent from '../components/event-edit.js';
import EventComponent from '../components/event.js';
import SortComponent, {SortType} from '../components/sort.js';
import EventOffersComponent from '../components/event-offers.js';
import EventDestinationComponent from '../components/event-destination.js';
import NoEventsComponent from '../components/no-events.js';
import {castTimeFormat} from '../utils/common.js';
import {RenderPosition, render, replace, remove} from '../utils/render.js';

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

const sortEvents = (events) => {
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
  return daysWithEvents;
};

const renderEvents = (container, eventsInDay) => {
  eventsInDay.forEach((event) => {
    renderEvent(event, container);
  });
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysComponent = null;
  }

  render(events) {

    if (!events || events.length === 0) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);

    const daysWithEvents = sortEvents(events);

    const renderEventsInDays = (eventsInDays) => {
      this._daysComponent = new DaysComponent(eventsInDays);
      if (eventsInDays[0].length === 0) {
        eventsInDays = eventsInDays.slice(1);
      }
      render(this._container, this._daysComponent, RenderPosition.BEFOREEND);
      const eventsListElements = this._container.querySelectorAll(`.trip-events__list`);
      eventsListElements.forEach((day, indexDay) => {
        renderEvents(day, eventsInDays[indexDay]);
      });
    };
    renderEventsInDays(daysWithEvents);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedEvents = [];

      switch (sortType) {
        case SortType.TIME:
          sortedEvents = events.slice();
          sortedEvents.forEach((event) => {
            const {endDate, startDate} = event;
            event.differenceInTime = endDate.getTime() - startDate.getTime();
          });
          sortedEvents = Array.of([], sortedEvents.sort((eventRight, eventLeft) => eventLeft.differenceInTime - eventRight.differenceInTime));
          break;
        case SortType.PRICE:
          sortedEvents = events.slice();
          sortedEvents.forEach((event) => {
            event.totalPrice = event.price + event.offers.reduce((amount, offer) => {
              return amount + offer.add;
            }, 0);
          });
          sortedEvents = Array.of([], sortedEvents.sort((eventRight, eventLeft) => eventLeft.totalPrice - eventRight.totalPrice));
          break;
        case SortType.DEFAULT:
          sortedEvents = daysWithEvents.slice();
          break;
      }
      remove(this._daysComponent);

      renderEventsInDays(sortedEvents);
    });


  }
}
