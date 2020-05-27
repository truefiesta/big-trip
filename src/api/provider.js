export default class Provider {
  constructor(api, eventsStore, destinationsStore, offersStore) {
    this._api = api;
    this._eventsStore = eventsStore;
    this._destinationsStore = destinationsStore;
    this._offersStore = offersStore;
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
