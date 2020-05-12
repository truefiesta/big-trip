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
  }

  render() {
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        title: filterType,
        isChecked: filterType === this._activeFilterType
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
    this._pointsModel.setFilter(FilterType.ALL);
    this._activeFilterType = FilterType.ALL;
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
