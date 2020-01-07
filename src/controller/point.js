import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import {render, replace, RenderPosition, remove} from '../utils/render.js';
import {Type} from '../const.js';
import EventModel from '../models/event.js';
import {getDateObject, getOffersByType} from '../utils/common.js';


export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyEvent = {
  type: Type.FLIGHT,
  destination: ``,
  photo: [],
  description: ``,
  startDate: new Date(),
  endDate: new Date(),
  price: 0,
  offers: [],
  isFavorite: false
};

const parseOffers = (formData, allOffers) => {
  const formDataKeys = [];
  formData.forEach((property, key) => formDataKeys.push(key));
  const resultOffers = allOffers.filter((item) => {
    return formDataKeys.some((key) => key === item.title)
  });
  return resultOffers;
};

const getDestinations = (destinationName, allDestinations) => {
  return allDestinations.filter((destination) => destination[`name`] === destinationName)[0];
};

const parseFormData = (rawData, allDestinations, allOffers) => {
  const {formData, type} = rawData;

  const result = new EventModel ({
    type,
    base_price: parseInt(formData.get(`price`), 10),
    date_from: getDateObject(formData.get(`event-start-time`)),
    date_to: getDateObject(formData.get(`event-end-time`)),
    is_favorite: formData.get(`favorite`) ? true : false,
    destination: getDestinations(formData.get(`destination`), allDestinations),
    offers: parseOffers(formData, getOffersByType(type, allOffers))
  });
  console.log(result)
  return result;
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, onFavoriteChange, eventsModel) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onFavoriteChange = onFavoriteChange;
    this._eventsModel = eventsModel;

    this._mode = Mode.DEFAULT;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, mode, adjacentElement) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;
    this._mode = mode;
    const destinations = this._eventsModel.getDestinations();
    const offers = this._eventsModel.getOffers();

    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EventEditComponent(event, this._onFavoriteChange, destinations, offers);

    this._eventComponent.setRollupButtonClickHandler(() => {
      this._replaceEventToEdit();
    });

    this._eventEditComponent.setRollupButtonClickHandler(() => {
      this._replaceEditToEvent();
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const rawData = this._eventEditComponent.getData();
      const data = parseFormData(rawData, this._eventsModel.getDestinations(), this._eventsModel.getOffers());
      this._onDataChange(this, event, data);
    });

    this._eventEditComponent.setCancelButtonClickHandler(() => {
      this._onDataChange(this, event, null);
    });

    this._eventEditComponent.setFavoriteInputClickHandler((evt, isFavorite) => {
      evt.preventDefault();
      const newEvent = EventModel.clone(event);
      newEvent.isFavorite = !isFavorite;
      this._onFavoriteChange(this._eventEditComponent, event, newEvent);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventEditComponent && oldEventComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
          this._replaceEditToEvent();
        } else {
          render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldEventEditComponent && oldEventComponent) {
          remove(oldEventEditComponent);
          remove(oldEventComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        if (adjacentElement) {
          render(this._container, this._eventEditComponent, RenderPosition.INSERT_BEFORE, adjacentElement);
        } else {
          render(this._container, this._eventEditComponent, RenderPosition.BEFOREEND);
        }
        break;
      /*case Mode.EDIT:
        replace(this._eventComponent, oldEventComponent);
        replace(this._eventEditComponent, oldEventEditComponent);
        this._replaceEventToEdit();*/
    }
  }

  getMode() {
    return this._mode;
  }

  destroy() {
    remove(this._eventEditComponent);
    remove(this._eventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._mode === Mode.ADDING) {
      return;
    }
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _replaceEditToEvent() {
    this._eventEditComponent.reset();

    replace(this._eventComponent, this._eventEditComponent);
    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceEventToEdit() {
    this._onViewChange();

    replace(this._eventEditComponent, this._eventComponent);
    this._mode = Mode.EDIT;
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyEvent, null);
      }
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
