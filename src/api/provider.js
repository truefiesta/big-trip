import PointModel from "../models/point.js";
import {nanoid} from "nanoid";

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createEventsStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

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
          this._eventsStore.setItem(newEvent.id, newEvent.convertToRaw());

          return newEvent;
        });
    }

    const localNewEventId = nanoid();

    event.setId(localNewEventId);

    const localNewEvent = PointModel.clone(event);
    this._eventsStore.setItem(localNewEvent.id, localNewEvent.convertToRaw());
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

          const items = createEventsStoreStructure(events.map((event) => event.convertToRaw()));

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

  sync() {
    if (this._isOnline() && this._isSyncRequired) {
      const storeEvents = Object.values(this._eventsStore.getItems());

      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = response.created;
          const updatedEvents = getSyncedEvents(response.updated);

          const items = createEventsStoreStructure([...createdEvents, ...updatedEvents]);

          this._eventsStore.setItems(items);
          this._isSyncRequired = false;

          return response;
        });
    }

    return Promise.resolve();
  }

  updateEvent(id, event) {
    if (this._isOnline()) {
      return this._api.updateEvent(id, event)
        .then((newEvent) => {
          this._eventsStore.setItem(newEvent.id, newEvent.convertToRaw());

          return newEvent;
        });
    }

    event.setId(id);
    const localEvent = PointModel.clone(event);
    this._eventsStore.setItem(id, localEvent.convertToRaw());
    this._isSyncRequired = true;

    return Promise.resolve(localEvent);
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
