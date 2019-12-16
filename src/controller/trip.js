import DaysComponent from '../components/days.js';
import SortComponent, {SortType} from '../components/sort.js';
import NoEventsComponent from '../components/no-events.js';
import {formatInDay} from '../utils/common.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import PointController from './point.js';

const renderEvents = (container, eventsInDay, onDataChange, onViewChange) => {
  const controllersInDay = [];
  eventsInDay.forEach((event) => {
    const pointController = new PointController(container, onDataChange, onViewChange);
    pointController.render(event);
    controllersInDay.push(pointController);
  });
  return controllersInDay;
};

const sortEvents = (events) => {
  const eventsSorted = events.sort((eventBefore, eventAfter) => eventBefore.startDate.getTime() - eventAfter.startDate.getTime());

  const daysEventAll = eventsSorted.map((event) => {
    const {startDate} = event;
    return formatInDay(startDate);
  });

  const daysEventInSet = new Set(daysEventAll);

  const createArrayEventsByDay = (day, array) => {
    return array.filter((event) => formatInDay(event.startDate) === day);
  };

  const daysEventInArray = Array.from(daysEventInSet);

  const daysWithEvents = daysEventInArray.map((day) => createArrayEventsByDay(day, eventsSorted));
  return daysWithEvents;
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._events = [];
    this._daysWithEvents = null;
    this._pointControllers = null;
    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._renderEventsInDays = this._renderEventsInDays.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(events) {
    this._events = events;

    if (!this._events || this._events === 0) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);

    this._daysWithEvents = sortEvents(events);

    this._pointControllers = this._renderEventsInDays(this._daysWithEvents);
  }

  _renderEventsInDays(eventsInDays) {
    this._daysComponent = new DaysComponent(eventsInDays);
    render(this._container, this._daysComponent, RenderPosition.BEFOREEND);
    const eventsListElements = this._container.querySelectorAll(`.trip-events__list`);
    let pointControllers = [];
    eventsListElements.forEach((day, indexDay) => {
      pointControllers = pointControllers.concat(renderEvents(day, eventsInDays[indexDay], this._onDataChange, this._onViewChange));
    });
    return pointControllers;
  }

  _onDataChange(taskController, oldData, newData) {
    const index = this._events.findIndex((event) => event === oldData);
    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));
    this._daysWithEvents = sortEvents(this._events);
    taskController.render(this._events[index]);
  }

  _onViewChange() {
    this._pointControllers.forEach((point) => point.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = this._events.slice();

    switch (sortType) {
      case SortType.TIME:
        sortedEvents = Array.of(sortedEvents.sort((eventRight, eventLeft) => {
          const eventLeftDifferenceTime = eventLeft.endDate.getTime() - eventLeft.startDate.getTime();
          const eventRightDifferenceTime = eventRight.endDate.getTime() - eventRight.startDate.getTime();
          return eventLeftDifferenceTime - eventRightDifferenceTime;
        }));
        remove(this._daysComponent);
        this._pointControllers = this._renderEventsInDays(sortedEvents);
        this._daysComponent.getElement().querySelector(`.day__info`).innerHTML = ``;
        break;
      case SortType.PRICE:
        sortedEvents = Array.of(sortedEvents.sort((eventRight, eventLeft) => eventLeft.price - eventRight.price));
        remove(this._daysComponent);
        this._pointControllers = this._renderEventsInDays(sortedEvents);
        this._daysComponent.getElement().querySelector(`.day__info`).innerHTML = ``;
        break;
      case SortType.DEFAULT:
        remove(this._daysComponent);
        this._pointControllers = this._renderEventsInDays(this._daysWithEvents.slice());
        break;
    }
  }
}
