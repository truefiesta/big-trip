import FilterComponent from "../components/filter.js";
import {FilterType} from "../const";
import {render, replace, RenderPosition} from "../utils/render.js";

export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onEventsChange = this._onEventsChange.bind(this);

    this._pointsModel.setEventsChangeHandler(this._onEventsChange);
  }

  render() {
    if (!this._pointsModel.hasEventsByFilterType(this._activeFilterType)) {
      this._resetFilterType();
    }

    const filters = Object.values(FilterType).map((filterType) => {
      const isEnabled = this._pointsModel.hasEventsByFilterType(filterType);

      return {
        title: filterType,
        isChecked: (filterType === this._activeFilterType) && isEnabled,
        isEnabled
      };
    });

    const oldFilterComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldFilterComponent) {
      replace(this._filterComponent, oldFilterComponent);
    } else {
      render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  reset() {
    this._resetFilterType();
    this.render();
  }

  _onEventsChange() {
    this.render();
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _resetFilterType() {
    this._pointsModel.setFilter(FilterType.ALL);
    this._activeFilterType = FilterType.ALL;
  }
}
