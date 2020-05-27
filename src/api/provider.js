import PointModel from "../models/point.js";
import {nanoid} from "nanoid";

export default class Provider {
  constructor(api, eventsStore, destinationsStore, offersStore) {
    this._api = api;
    this._eventsStore = eventsStore;
    this._destinationsStore = destinationsStore;
    this._offersStore = offersStore;
    this._isSyncRequired = false;
  }

  createEvent(event) {
    if (this._isOnline()) {
      return this._api.createEvent(event)
        .then((newEvent) => {
          this._eventsStore.setItem(newEvent.id, newEvent.toRAW());

          return newEvent;
        });
    }

    const localNewEventId = nanoid();

    event.setId(localNewEventId);

    const localNewEvent = PointModel.clone(event);
    this._eventsStore.setItem(localNewEvent.id, localNewEvent.toRAW());
    this._isSyncRequired = true;

    return Promise.resolve(localNewEvent);
  }

  deleteEvent(id) {
    if (this._isOnline()) {
      return this._api.deleteEvent(id)
        .then(() => this._eventsStore.removeItem(id));
    }

    this._eventsStore.removeItem(id);
    this._isSyncRequired = true;

    return Promise.resolve();
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
      return this._api.updateEvent(id, event)
        .then((newEvent) => {
          this._eventsStore.setItem(newEvent.id, newEvent.toRAW());

          return newEvent;
        });
    }

    event.setId(id);
    const localEvent = PointModel.clone(event);
    this._eventsStore.setItem(id, localEvent.toRAW());
    this._isSyncRequired = true;

    return Promise.resolve(localEvent);
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
