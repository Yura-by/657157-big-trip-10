import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import {render, replace, RenderPosition, remove} from '../utils/render.js';
import {Type} from '../const.js';
import EventModel from '../models/event.js';
import {getDateStructure} from '../utils/common.js';

const SHAKE_ANIMATION_TIMEOUT = 600;
const NUMBER_SYSTEM = 10;
const MILISECONDS = 1000;
const SHADOW_STYLE = `0 0 10px 5px red`;
const EMPTY_EVENT = new EventModel(EventModel.toRawFromCustom({
  type: Type.FLIGHT,
  offers: [],
  price: ``,
  startDate: new Date(),
  endDate: new Date(),
  isFavorite: false,
  destination: {
    name: ``,
    pictures: [],
    description: ``
  }
}));

const Designation = {
  FULL: `Escape`,
  ABBREVIATED: `Esc`
};

const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

const CustomText = {
  SAVE: `Save`,
  DELETE: `Delete`,
  SAVING: `Saving...`,
  DELETING: `Deleting...`,
  CANCEL: `Cancel`
};

const getDestinations = (destinationName, allDestinations) => {
  return allDestinations.find((destination) => destination[`name`] === destinationName);
};

const parseFormData = (rawData, allDestinations) => {
  const {formData, type, offers, isFavorite} = rawData;
  const result = new EventModel(EventModel.toRawFromCustom({
    type,
    offers,
    price: parseInt(formData.get(`price`), NUMBER_SYSTEM),
    startDate: getDateStructure(formData.get(`event-start-time`)),
    endDate: getDateStructure(formData.get(`event-end-time`)),
    isFavorite,
    destination: getDestinations(formData.get(`destination`), allDestinations)
  }));
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
      if (this._eventEditComponent.getSandingState()) {
        return;
      }
      if (this._mode === Mode.ADDING) {
        this._eventEditComponent.setData({
          saveButtonText: CustomText.SAVING,
          deleteButtonText: CustomText.CANCEL
        });
      } else {
        this._eventEditComponent.setData({
          saveButtonText: CustomText.SAVING
        });
      }
      this._eventEditComponent.setDisabledState();
      const rawData = this._eventEditComponent.getData();
      const data = parseFormData(rawData, this._eventsModel.getDestinations(), this._eventsModel.getOffers());

      this._onDataChange(this, event, data);
    });

    this._eventEditComponent.setCancelButtonClickHandler(() => {
      this._eventEditComponent.setData({
        deleteButtonText: CustomText.DELETING
      });
      this._eventEditComponent.setDisabledState();
      this._onDataChange(this, event, null);
    });

    this._eventEditComponent.setFavoriteInputClickHandler((evt, isFavorite) => {
      evt.preventDefault();
      const newEvent = EventModel.clone(event);
      newEvent.isFavorite = !isFavorite;
      this._onFavoriteChange(this._eventEditComponent, event, newEvent, this);
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
        this._eventEditComponent.setData({
          deleteButtonText: CustomText.CANCEL
        });
        document.addEventListener(`keydown`, this._onEscKeyDown);
        if (adjacentElement) {
          render(this._container, this._eventEditComponent, RenderPosition.INSERT_BEFORE, adjacentElement);
        } else {
          render(this._container, this._eventEditComponent, RenderPosition.BEFOREEND);
        }
        break;
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
    const isEscKey = evt.key === Designation.FULL || evt.key === Designation.ABBREVIATED;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EMPTY_EVENT, null);
      }
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  shake() {
    this._eventEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MILISECONDS}s`;
    this._eventEditComponent.getElement().style.boxShadow = SHADOW_STYLE;
    setTimeout(() => {
      this._eventEditComponent.getElement().style.animation = ``;
      if (this._mode === Mode.ADDING) {
        this._eventEditComponent.setData({
          saveButtonText: CustomText.SAVE,
          deleteButtonText: CustomText.CANCEL
        });
      } else {
        this._eventEditComponent.setData({
          saveButtonText: CustomText.SAVE,
          deleteButtonText: CustomText.DELETE
        });
      }
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}

export {Mode, EMPTY_EVENT};
