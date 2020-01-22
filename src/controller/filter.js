import FilterComponent from '../components/site-filter.js';
import {FilterType} from '../const.js';
import {render, RenderPosition} from '../utils/render.js';
import {getEventsByFilter} from '../utils/filter.js';

const EMPTY_NUMBER = 0;

export default class Filter {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onEventsChange = this._onEventsChange.bind(this);
    this._eventsModel.setDataChangeHandler(this._onEventsChange);
  }

  render() {
    const container = this._container;
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        checked: filterType === this._activeFilterType
      };
    });
    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);
    render(container, this._filterComponent, RenderPosition.BEFOREEND);
  }

  show() {
    if (this._filterComponent) {
      this._filterComponent.show();
    }
  }

  hide() {
    if (this._filterComponent) {
      this._filterComponent.hide();
    }
  }

  _onFilterChange(filterType) {
    this._eventsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onEventsChange() {
    this._filterComponent.setFiltersUndisabled();
    const eventsFromModel = this._eventsModel.getEventsAll();
    const pastEvents = getEventsByFilter(eventsFromModel, FilterType.PAST);
    if (pastEvents.length === EMPTY_NUMBER) {
      this._filterComponent.setFilterDisabled(FilterType.PAST);
    }
    const futureEvents = getEventsByFilter(eventsFromModel, FilterType.FUTURE);
    if (futureEvents.length === EMPTY_NUMBER) {
      this._filterComponent.setFilterDisabled(FilterType.FUTURE);
    }
    if (eventsFromModel.length === EMPTY_NUMBER) {
      this._filterComponent.setFilterDisabled(FilterType.EVERYTHING);
    }
  }
}
