import FilterComponent from '../components/site-filter.js';
import {FilterType} from '../const.js';
import {render, RenderPosition} from '../utils/render.js';
import {getEventsByFilter} from '../utils/filter.js';

export default class FilterController {
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

  _onFilterChange(filterType) {
    this._eventsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onEventsChange() {
    this._filterComponent.setFiltersUndisabled();
    const pastEvents = getEventsByFilter(this._eventsModel.getEventsAll(), FilterType.PAST);
    if (pastEvents.length === 0) {
      this._filterComponent.setFilterDisabled(FilterType.PAST);
    }
    const futureEvents = getEventsByFilter(this._eventsModel.getEventsAll(), FilterType.FUTURE);
    if (futureEvents.length === 0) {
      this._filterComponent.setFilterDisabled(FilterType.FUTURE);
    }
  }
}
