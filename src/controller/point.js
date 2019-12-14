import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import EventDetailsComponent from '../components/event-details.js';
import EventOffersComponent from '../components/event-offers.js';
import EventDestinationComponent from '../components/event-destination.js';

import {render, replace, RenderPosition} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._eventComponent = null;
    this._eventEditComponent = null;
    this._eventDetailsComponent = null;
    this._eventOffersComponent = null;
    this._eventDestinationComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventComponent(task);
    this._eventEditComponent = new EventEditComponent(task);

    this._eventComponent.setRollupButtonClickHandler(() => {
      this._replaceEditToEvent();
      document.addEventListener(`keydown`, escKeydownHandler);
    });

    this._eventEditComponent.setRollupButtonClickHandler(() => {
      _replaceEventToEdit();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setSubmitHandler(() => {
      _replaceEventToEdit();
    });

    this._eventEditComponent.setFavoriteInputClickHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavorite: !isFavorite,
      }));
    });

    this._eventDetailsComponent = new EventDetailsComponent();

    render(eventEditComponent.getElement(), eventDetailsComponent, RenderPosition.BEFOREEND);
    render(eventDetailsComponent.getElement(), new EventOffersComponent(event), RenderPosition.BEFOREEND);
    render(eventDetailsComponent.getElement(), new EventDestinationComponent(event), RenderPosition.BEFOREEND);

    if (oldEventEditComponent && oldEventComponent) {
      replace(this._eventComponent, oldEventComponent);
      replace(this._eventEditComponent, oldEventEditComponent);
    } else {
      render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  _replaceEditToEvent = () => {
    this._eventEditComponent.reset();

    replace(this._eventEditComponent, this._eventComponent);
    this._mode = Mode.DEFAULT;
  };

  _replaceEventToEdit = () => {
    this._onViewChange();

    replace(this._eventComponent, this._eventEditComponent);
    this._mode = Mode.EDIT;
  };

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEventToEdit();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}



