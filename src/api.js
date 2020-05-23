import PointModel from "./models/point.js";

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getEvents() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/points`, {headers})
      .then(checkStatus)
      .then((events) => events.json())
      .then(PointModel.parseEvents);
  }

  getDestinations() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/destinations`, {headers})
    .then(checkStatus)
    .then((destinations) => destinations.json());
  }

  getOffers() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    return fetch(`https://11.ecmascript.pages.academy/big-trip/offers`, {headers})
    .then(checkStatus)
    .then((offers) => offers.json());
  }

  updateEvent(id, event) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-Type`, `application/json`);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/points/${id}`, {
      method: `PUT`,
      body: JSON.stringify(event.toRAW()),
      headers
    })
      .then(checkStatus)
      .then((response) => response.json())
      .then(PointModel.parseEvent);
  }
}
