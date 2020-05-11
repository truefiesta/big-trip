export default class PointsModel {
  constructor() {
    this._events = [];

    this._eventDataChangeHandlers = [];
  }

  // Метод для получения всех точек маршрута.
  getAllEvents() {
    return this._events;
  }

  // Метод для записи точек маршрута
  setEvents(events) {
    this._events = Array.from(events);
    this._callHandlers(this._eventDataChangeHandlers);
  }

  // Метод для обновления конкретной точки маршрута.
  updadeEvent(id, event) {
    const index = this._events.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), event, this._events.slice(index + 1));

    this._callHandlers(this._eventDataChangeHandlers);

    return true;
  }

  setEventDataChangeHandler(handler) {
    this._eventDataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
