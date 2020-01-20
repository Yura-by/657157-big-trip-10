import DaysComponent from '../components/days.js';
import SortComponent, {SortType} from '../components/sort.js';
import NoEventsComponent from '../components/no-events.js';
import {formatInDay, sortEventsInOrder} from '../utils/common.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import PointController, {Mode as PointControllerMode, EMPTY_EVENT} from './point.js';
import {FilterType, HIDDEN_CLASS} from '../const.js';
import TripInfoComponent from '../components/trip-info.js';
import {getTripInfoContent} from '../utils/trip-info.js';

const EMPTY_NUMBER = 0;

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

  const daysEventUnique = new Set(daysEventAll);

  const createEventsByDay = (day, points) => {
    return points.filter((point) => formatInDay(point.startDate) === day);
  };

  const daysEvents = Array.from(daysEventUnique);

  const daysWithEvents = daysEvents.map((day) => createEventsByDay(day, eventsSorted));
  return daysWithEvents;
};

export default class TripController {
  constructor(container, eventsModel, api, newEventButton) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._api = api;

    this._daysWithEvents = null;
    this._pointControllers = [];
    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysComponent = null;
    this._creatingEvent = null;
    this._tripInfoComponent = null;
    this._newEventButton = newEventButton;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._renderEventsInDays = this._renderEventsInDays.bind(this);
    this._tripRerender = this._tripRerender.bind(this);
    this._onDataModulChange = this._onDataModulChange.bind(this);
    this._onFavoriteChange = this._onFavoriteChange.bind(this);
    this._tripSynchronization = this._tripSynchronization.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._eventsModel.setFilterChangeHandler(this._tripRerender);
    this._eventsModel.setDataChangeHandler(this._onDataModulChange);
    this._eventsModel.setDataUpdateHandler(this._tripSynchronization);
  }

  hide() {
    this._container.classList.add(HIDDEN_CLASS);
  }

  show() {
    this._container.classList.remove(HIDDEN_CLASS);
  }

  render() {
    const events = this._eventsModel.getEvents();
    this._newEventButton.disabled = false;

    if (!events || events === EMPTY_NUMBER || events.length === EMPTY_NUMBER) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);

    this._daysWithEvents = sortEvents(events);

    this._pointControllers = this._renderEventsInDays(this._daysWithEvents);
  }

  createEvent() {
    this._newEventButton.disabled = true;
    if (this._creatingEvent) {
      return;
    }

    this._pointControllers.forEach((point) => point.setDefaultView());

    if (this._noEventsComponent) {
      remove(this._noEventsComponent);
    }

    this._creatingEvent = new PointController(this._container, this._onDataChange, this._onViewChange, null, this._eventsModel);
    this._pointControllers.unshift(this._creatingEvent);

    if (document.contains(this._daysComponent.getElement())) {
      this._creatingEvent.render(EMPTY_EVENT, PointControllerMode.ADDING, this._daysComponent.getElement());
    } else {
      this._creatingEvent.render(EMPTY_EVENT, PointControllerMode.ADDING);
    }
  }

  _renderEventsInDays(eventsInDays) {
    this._daysComponent = new DaysComponent(eventsInDays);
    render(this._container, this._daysComponent, RenderPosition.BEFOREEND);
    const eventsListElements = this._daysComponent.getDaysElements();
    let pointControllers = [];
    eventsListElements.forEach((day, indexDay) => {
      pointControllers = pointControllers.concat(renderEvents(day, eventsInDays[indexDay], this._onDataChange, this._onViewChange, this._onFavoriteChange, this._eventsModel));
    });
    return pointControllers;
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = this._eventsModel.getEvents().slice();

    switch (sortType) {
      case SortType.TIME:
        if (sortedEvents.length > EMPTY_NUMBER) {
          sortedEvents = Array.of(sortedEvents.sort((eventRight, eventLeft) => {
            const eventLeftDifferenceTime = eventLeft.endDate.getTime() - eventLeft.startDate.getTime();
            const eventRightDifferenceTime = eventRight.endDate.getTime() - eventRight.startDate.getTime();
            return eventLeftDifferenceTime - eventRightDifferenceTime;
          }));
        }
        this._removeEvents();
        this._pointControllers = this._renderEventsInDays(sortedEvents);
        this._clearDaysTitle();
        break;
      case SortType.PRICE:
        if (sortedEvents.length > EMPTY_NUMBER) {
          sortedEvents = Array.of(sortedEvents.sort((eventRight, eventLeft) => eventLeft.price - eventRight.price));
        }
        this._removeEvents();
        this._pointControllers = this._renderEventsInDays(sortedEvents);
        this._clearDaysTitle();
        break;
      case SortType.DEFAULT:
        this._removeEvents();
        this._pointControllers = this._renderEventsInDays(this._daysWithEvents.slice());
        break;
    }

    const filterValue = this._eventsModel.getFilterName();
    if (filterValue !== FilterType.EVERYTHING) {
      this._clearDaysTitle();
    }
  }

  _removeEvents() {
    if (this._pointControllers) {
      this._pointControllers.forEach((pointController) => pointController.destroy());
      this._pointControllers = [];
      this._creatingEvent = null;
      this._newEventButton.disabled = false;
      if (this._daysComponent) {
        remove(this._daysComponent);
      }
    }
  }

  _clearDaysTitle() {
    this._daysComponent.clearDaysContent();
  }

  _tripRerender() {
    if (!document.contains(this._sortComponent.getElement())) {
      const events = this._eventsModel.getEvents();
      this._daysWithEvents = sortEvents(events);
      if (events.length > EMPTY_NUMBER) {
        render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
        this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
      }
      this._pointControllers = this._renderEventsInDays(this._daysWithEvents);
      return;
    }
    const activeSortType = this._sortComponent.getCheckedSortType();
    if (activeSortType !== SortType.DEFAULT) {
      this._onSortTypeChange(activeSortType);
    } else {
      this._removeEvents();
      this._daysWithEvents = sortEvents(this._eventsModel.getEvents());
      this._pointControllers = this._renderEventsInDays(this._daysWithEvents);
      const filterValue = this._eventsModel.getFilterName();
      if (filterValue !== FilterType.EVERYTHING) {
        this._clearDaysTitle();
      }
    }
  }

  _tripSynchronization() {
    this._tripRerender();
    this._creatingEvent = null;
    this._newEventButton.disabled = false;
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EMPTY_EVENT) {
      this._creatingEvent = null;
      if (newData === null) {
        pointController.destroy();
        this._pointControllers.shift();
        if (this._pointControllers.length === EMPTY_NUMBER) {
          render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
        }
      } else {
        this._api.createEvent(newData)
          .then((eventModel) => {
            this._eventsModel.addEvent(eventModel);
            pointController.destroy();
            this._tripRerender();
          })
          .catch(() => {
            pointController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deleteEvent(oldData.id)
        .then(() => {
          this._eventsModel.removeEvent(oldData.id);
          if (this._eventsModel.getEventsAll().length === EMPTY_NUMBER) {
            pointController.destroy();
            this._pointControllers = [];
            remove(this._daysComponent);
          } else {
            this._tripRerender();
          }
        })
        .catch(() => {
          pointController.shake();
        });
    } else {
      this._api.updateEvent(oldData.id, newData)
        .then((eventModel) => {
          const isSuccess = this._eventsModel.updateEvent(oldData.id, eventModel);
          if (isSuccess) {
            this._tripRerender();
          }
        })
        .catch(() => {
          pointController.shake();
        });
    }
    if (this._creatingEvent === null) {
      this._newEventButton.disabled = false;
    }
  }

  _onFavoriteChange(editComponent, oldData, newData, pointController) {
    this._api.updateEvent(oldData.id, newData)
      .then((eventModel) => {
        const isSuccess = this._eventsModel.updateEvent(oldData.id, eventModel);
        if (isSuccess) {
          editComponent.rerender(eventModel);
        }
      })
      .catch(() => {
        pointController.shake();
      });
  }

  _onDataModulChange() {
    this._daysWithEvents = sortEvents(this._eventsModel.getEvents());
    if (this._eventsModel.getEventsAll().length === EMPTY_NUMBER) {
      remove(this._sortComponent);
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
    }
    const pointsSorted = sortEventsInOrder(this._eventsModel.getEventsAll());
    const totalPrice = pointsSorted.reduce((total, event) => {
      const {price, offers} = event;
      const offersPrice = offers.reduce((totalOffer, offer) => {
        return totalOffer + offer.price;
      }, EMPTY_NUMBER);
      return total + price + offersPrice;
    }, EMPTY_NUMBER);
    document.querySelector(`.trip-info__cost-value`).textContent = totalPrice;
    const infoContainerElement = document.querySelector(`.trip-main__trip-info`);
    if (this._tripInfoComponent) {
      remove(this._tripInfoComponent);
    }
    this._tripInfoComponent = new TripInfoComponent(getTripInfoContent(pointsSorted));
    render(infoContainerElement, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _onViewChange() {
    const addingConroller = this._pointControllers[EMPTY_NUMBER];
    if (addingConroller && addingConroller.getMode() === PointControllerMode.ADDING) {
      addingConroller.destroy();
      this._pointControllers.shift();
      this._creatingEvent = null;
      this._newEventButton.disabled = false;
    }
    this._pointControllers.forEach((point) => point.setDefaultView());
  }
}
