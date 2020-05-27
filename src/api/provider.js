export default class Provider {
  constructor(api) {
    this._api = api;
  }

  createEvent(event) {
    return this._api.createEvent(event);
  }

  deleteEvent(id) {
    return this._api.deleteEvent(id);
  }

  getEvents() {
    return this._api.getEvents();
  }

  getDestinations() {
    return this._api.getDestinations();
  }

  getOffers() {
    return this._api.getOffers();
  }

  updateEvent(id, event) {
    return this._api.updateEvent(id, event);
  }
}
