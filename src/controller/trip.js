import DaysComponent from '../components/days.js';
import SortComponent, {SortType} from '../components/sort.js';
import NoEventsComponent from '../components/no-events.js';
import {formatInDay, sortEventsInOrder} from '../utils/common.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import PointController, {Mode as PointControllerMode, EmptyEvent} from './point.js';
import {FilterType, HIDDEN_CLASS} from '../const.js';

const renderEvents = (container, eventsInDay, onDataChange, onViewChange, onFavoriteChange, eventsModel) => {
  const controllersInDay = [];
  eventsInDay.forEach((event) => {
    const pointController = new PointController(container, onDataChange, onViewChange, onFavoriteChange, eventsModel);
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
  constructor(container, eventsModel, api) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._api = api;

    this._daysWithEvents = null;
    this._pointControllers = [];
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
    this._eventsModel.setDataChangeHandler(this._onDataModulChange);
  }

  hide() {
    this._container.classList.add(HIDDEN_CLASS);
  }

  show() {
    this._container.classList.remove(HIDDEN_CLASS);
  }

  render() {
    const events = this._eventsModel.getEvents();

    if (!events || events === 0 || events.length === 0) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);

    this._daysWithEvents = sortEvents(events);
    console.log(this._daysWithEvents)

    this._pointControllers = this._renderEventsInDays(this._daysWithEvents);
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }

    this._pointControllers.forEach((point) => point.setDefaultView());

    if (this._noEventsComponent) {
      remove(this._noEventsComponent);
    }

    const adjacentElement = this._container.querySelector(`.trip-days`);
    this._creatingEvent = new PointController(this._container, this._onDataChange, this._onViewChange, null);
    this._pointControllers.unshift(this._creatingEvent);

    if (adjacentElement) {
      this._creatingEvent.render(EmptyEvent, PointControllerMode.ADDING, adjacentElement);
    } else {
      this._creatingEvent.render(EmptyEvent, PointControllerMode.ADDING);
    }
  }

  _renderEventsInDays(eventsInDays) {
    this._daysComponent = new DaysComponent(eventsInDays);
    render(this._container, this._daysComponent, RenderPosition.BEFOREEND);
    const eventsListElements = this._container.querySelectorAll(`.trip-events__list`);
    let pointControllers = [];
    eventsListElements.forEach((day, indexDay) => {
      pointControllers = pointControllers.concat(renderEvents(day, eventsInDays[indexDay], this._onDataChange, this._onViewChange, this._onFavoriteChange, this._eventsModel));
    });
    return pointControllers;
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyEvent) {
      this._creatingEvent = null;
      if (newData === null) {
        pointController.destroy();
        this._pointControllers.shift();
        if (this._pointControllers.length === 0) {
          render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
        }
      } else {
        this._eventsModel.addEvent(newData);
        pointController.destroy();
        this._removeEvents();
        render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
        this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
        this._pointControllers = this._renderEventsInDays(this._daysWithEvents);
      }
    } else if (newData === null) {
      this._eventsModel.removeEvent(oldData.id);
      remove(this._daysComponent);
      this._pointControllers = this._renderEventsInDays(this._daysWithEvents);
    } else {
      this._api.updateEvent(oldData.id, newData)
        .then((eventModel) => {
          const isSuccess = this._eventsModel.updateEvent(oldData.id, eventModel);
          if (isSuccess) {
            this._onFilterChange();
          }
        });
    }
  }

  _onFavoriteChange(editComponent, oldData, newData) {
    this._api.updateEvent(oldData.id, newData)
      .then((eventModel) => {
        const isSuccess = this._eventsModel.updateEvent(oldData.id, eventModel);
        if (isSuccess) {
          editComponent.rerender(eventModel);
        }
      });
  }

  _onDataModulChange() {
    this._daysWithEvents = sortEvents(this._eventsModel.getEvents());
    if (this._eventsModel.getEventsAll().length === 0) {
      remove(this._sortComponent);
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
    }
  }

  _onViewChange() {
    const addingConroller = this._pointControllers[0];
    if (addingConroller && addingConroller.getMode() === PointControllerMode.ADDING) {
      addingConroller.destroy();
      this._pointControllers.shift();
      this._creatingEvent = null;
    }
    this._pointControllers.forEach((point) => point.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = this._eventsModel.getEvents().slice();

    switch (sortType) {
      case SortType.TIME:
        if (sortedEvents.length > 0) {
          sortedEvents = Array.of(sortedEvents.sort((eventRight, eventLeft) => {
            const eventLeftDifferenceTime = eventLeft.endDate.getTime() - eventLeft.startDate.getTime();
            const eventRightDifferenceTime = eventRight.endDate.getTime() - eventRight.startDate.getTime();
            return eventLeftDifferenceTime - eventRightDifferenceTime;
          }));
        }
        remove(this._daysComponent);
        console.log(sortedEvents)
        this._pointControllers = this._renderEventsInDays(sortedEvents);
        this._clearDaysTitle();
        break;
      case SortType.PRICE:
        if (sortedEvents.length > 0) {
          sortedEvents = Array.of(sortedEvents.sort((eventRight, eventLeft) => eventLeft.price - eventRight.price));
        }
        remove(this._daysComponent);
        this._pointControllers = this._renderEventsInDays(sortedEvents);
        this._clearDaysTitle()
        break;
      case SortType.DEFAULT:
        remove(this._daysComponent);
        this._pointControllers = this._renderEventsInDays(this._daysWithEvents.slice());
        break;
    }

    const filterValue = this._eventsModel.getFilterName();
    if (filterValue !== FilterType.EVERYTHING) {
      this._clearDaysTitle()
    }
  }

  _removeEvents() {
    if (this._pointControllers) {
      this._pointControllers.forEach((pointController) => pointController.destroy());
      this._pointControllers = [];
      if (this._daysComponent) {
        remove(this._daysComponent);
      }
    }
  }

  _clearDaysTitle() {
    const daysCollection = this._daysComponent.getElement().querySelectorAll(`.day__info`);
    if (daysCollection) {
      daysCollection.forEach((day) => {
        day.innerHTML = ``;
      });
    }
  }

  _onFilterChange() {
    const sortType = this._container.querySelectorAll(`.trip-sort__input`);
    const activeSortType = Array.from(sortType).find((item) => item.checked).dataset.sortType;
    if (activeSortType !== SortType.DEFAULT) {
      this._onSortTypeChange(activeSortType);
    } else {
      this._removeEvents();
      this._daysWithEvents = sortEvents(this._eventsModel.getEvents());
      this._pointControllers = this._renderEventsInDays(this._daysWithEvents);
      const filterValue = this._eventsModel.getFilterName();
      if (filterValue !== FilterType.EVERYTHING) {
        this._clearDaysTitle()
      }
    }
  }
}
