import DaysComponent from '../components/days.js';
import SortComponent, {SortType} from '../components/sort.js';
import NoEventsComponent from '../components/no-events.js';
import {formatInDay, sortEventsInOrder} from '../utils/common.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import PointController, {Mode as PointControllerMode, EmptyEvent} from './point.js';

const renderEvents = (container, eventsInDay, onDataChange, onViewChange, onFavoriteChange) => {
  const controllersInDay = [];
  eventsInDay.forEach((event) => {
    const pointController = new PointController(container, onDataChange, onViewChange, onFavoriteChange);
    pointController.render(event, PointControllerMode.DEFAULT);
    controllersInDay.push(pointController);
  });
  return controllersInDay;
};

const sortEvents = (events) => {
  const eventsSorted = sortEventsInOrder(events);

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
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._daysWithEvents = null;
    this._pointControllers = null;
    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysComponent = null;
    this._creatingEvent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._renderEventsInDays = this._renderEventsInDays.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataModulChange = this._onDataModulChange.bind(this);
    this._onFavoriteChange = this._onFavoriteChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const events = this._eventsModel.getEvents();

    if (!events || events === 0) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);

    this._daysWithEvents = sortEvents(events);

    this._pointControllers = this._renderEventsInDays(this._daysWithEvents);
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }

    const eventListElement = this._container.querySelector(`.trip-events__list`);
    this._creatingEvent = new PointController(eventListElement, this._onDataChange, this._onViewChange, this._onFavoriteChange);
    this._creatingEvent.render(EmptyEvent, PointControllerMode.ADDING);

  }

  _renderEventsInDays(eventsInDays) {
    this._daysComponent = new DaysComponent(eventsInDays);
    render(this._container, this._daysComponent, RenderPosition.BEFOREEND);
    const eventsListElements = this._container.querySelectorAll(`.trip-events__list`);
    let pointControllers = [];
    eventsListElements.forEach((day, indexDay) => {
      pointControllers = pointControllers.concat(renderEvents(day, eventsInDays[indexDay], this._onDataChange, this._onViewChange, this._onFavoriteChange));
    });
    return pointControllers;
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyEvent) {
      this._creatingEvent = null;
      if (newData === null) {
        pointController.destroy();
      } else {
        this._eventsModel.addEvent(newData);
        pointController.render(newData, PointControllerMode.DEFAULT);

        this._pointControllers = [].concat(pointController, this._pointControllers);
      }
    } else if (newData === null) {
      this._eventsModel.removeEvent(oldData.id);
      remove(this._daysComponent);
      this._pointControllers = this._renderEventsInDays(this._daysWithEvents);
    } else {
      const isSuccess = this._eventsModel.updateEvent(oldData.id, newData);

      if (isSuccess) {
        pointController.render(newData, PointControllerMode.DEFAULT);
      }
    }
  }

  _onFavoriteChange(oldData, newData) {
    this._eventsModel.updateEvent(oldData.id, newData);
  }

  _onDataModulChange() {
    this._daysWithEvents = sortEvents(this._eventsModel.getEvents());
  }

  _onViewChange() {
    this._pointControllers.forEach((point) => point.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = this._eventsModel.getEvents().slice();

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

  _removeEvents() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
    remove(this._daysComponent);
  }

  _onFilterChange() {
    this._removeEvents();
    this._daysWithEvents = sortEvents(this._eventsModel.getEvents());
    this._pointControllers = this._renderEventsInDays(this._daysWithEvents);
  }


}
