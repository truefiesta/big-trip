import PointModel from "../models/point.js";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  createEvent(event) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(event.convertToRaw()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(PointModel.parseEvent);
  }

  deleteEvent(id) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  getEvents() {
    return this._load({url: `points`})
      .then((events) => events.json())
      .then(PointModel.parseEvents);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then((destinations) => destinations.json());
  }

  getOffers() {
    return this._load({url: `offers`})
      .then((offers) => offers.json());
  }

  sync(events) {
    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(events),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  updateEvent(id, event) {
    return this._load({
      url: `points/${id}`,
      method: `PUT`,
      body: JSON.stringify(event.convertToRaw()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((updatedEvent) => updatedEvent.json())
      .then(PointModel.parseEvent);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
