import PointModel from "../models/point.js";

export default class Provider {
  constructor(api, eventsStore, destinationsStore, offersStore) {
    this._api = api;
    this._eventsStore = eventsStore;
    this._destinationsStore = destinationsStore;
    this._offersStore = offersStore;
  }

  createEvent(event) {
    if (this._isOnline()) {
      return this._api.createEvent(event);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  deleteEvent(id) {
    if (this._isOnline()) {
      return this._api.deleteEvent(id);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  getEvents() {
    if (this._isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = events.reduce((acc, currentEvent) => {
            return Object.assign({}, acc, {
              [currentEvent.id]: currentEvent,
            });
          }, {});

          this._eventsStore.setItems(items);

          return events;
        });
    }

    const storeEvents = Object.values(this._eventsStore.getItems());

    return Promise.resolve(PointModel.parseEvents(storeEvents));
  }

  getDestinations() {
    if (this._isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._destinationsStore.setItems(destinations);

          return destinations;
        });
    }

    const storeDestinations = this._destinationsStore.getItems();

    return Promise.resolve(storeDestinations);
  }

  getOffers() {
    if (this._isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._offersStore.setItems(offers);

          return offers;
        });
    }

    const storeOffers = this._offersStore.getItems();

    return Promise.resolve(storeOffers);
  }

  updateEvent(id, event) {
    if (this._isOnline()) {
      return this._api.updateEvent(id, event);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
