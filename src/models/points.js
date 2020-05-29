import {FilterType, SortType} from "../const.js";
import {getEventsByFilter} from "../utils/filter.js";
import {getSortedEvents} from "../utils/common.js";

export default class PointsModel {
  constructor() {
    this._events = [];

    this._activeFilterType = FilterType.ALL;

    this._filterChangeHandlers = [];
    this._eventDataChangeHandlers = [];
  }

  getEvents() {
    return getEventsByFilter(this._events, this._activeFilterType);
  }

  getAllEvents() {
    return this._events;
  }

  getEventsSortedByStartTime() {
    return getSortedEvents(this._events, SortType.SORT_EVENT);
  }

  hasEventsByFilterType(filterType) {
    return getEventsByFilter(this._events, filterType).length > 0;
  }

  setEvents(events) {
    this._events = Array.from(events);
    this._callHandlers(this._eventDataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  addEvent(event) {
    this._events = [].concat(event, this._events);
    this._callHandlers(this._eventDataChangeHandlers);
  }

  removeEvent(id) {
    const index = this._events.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), this._events.slice(index + 1));

    this._callHandlers(this._eventDataChangeHandlers);

    return true;
  }

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
