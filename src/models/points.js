import {FilterType} from "../const.js";
import {getEventsByFilter} from "../utils/filter.js";

export default class PointsModel {
  constructor() {
    this._events = [];

    this._activeFilterType = FilterType.ALL;

    this._filterChangeHandlers = [];
    this._eventDataChangeHandlers = [];
  }

  // Метод для получения отфильтрованных точек маршрута.
  getEvents() {
    return getEventsByFilter(this._events, this._activeFilterType);
  }

  // Метод для записи точек маршрута
  setEvents(events) {
    this._events = Array.from(events);
    this._callHandlers(this._eventDataChangeHandlers);
  }

  // Метод для установки выбранного фильтра.
  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  // Метод для добавления точки маршрута.
  addEvent(event) {
    this._events = [].concat(event, this._events);
    this._callHandlers(this._eventDataChangeHandlers);
  }

  // Метод для удаления конкретной точки маршрута.
  removeEvent(id) {
    const index = this._events.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), this._events.slice(index + 1));

    this._callHandlers(this._eventDataChangeHandlers);

    return true;
  }

  // Метод для обновления конкретной точки маршрута.
  updateEvent(id, event) {
    const index = this._events.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), event, this._events.slice(index + 1));

    this._callHandlers(this._eventDataChangeHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setEventsChangeHandler(handler) {
    this._eventDataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
