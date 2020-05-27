import {getDestinationInformation} from "../utils/common.js";

export default class Point {
  constructor(event) {
    this.id = event[`id`];
    this.type = event[`type`];
    this.destination = event[`destination`][`name`];
    this.offers = event[`offers`];
    this.destinationInfo = {
      description: event[`destination`][`description`],
      photos: event[`destination`][`pictures`]
    };
    this.time = {
      startTime: new Date(event[`date_from`]),
      endTime: new Date(event[`date_to`])
    };
    this.price = event[`base_price`];
    this.isFavorite = Boolean(event[`is_favorite`]);
  }

  setId(id) {
    this.id = id;
  }

  toRAW() {
    const destinationInfo = getDestinationInformation(this.destination);

    return {
      // "id": this.id,
      "type": this.type,
      "destination": {
        "name": this.destination,
        "description": destinationInfo.description,
        "pictures": destinationInfo.pictures
      },
      "offers": this.offers,
      "date_from": this.time.startTime.toISOString(),
      "date_to": this.time.endTime.toISOString(),
      "base_price": this.price,
      "is_favorite": this.isFavorite
    };
  }

  static parseEvent(event) {
    return new Point(event);
  }

  static parseEvents(events) {
    return events.map(Point.parseEvent);
  }

  static clone(event) {
    return new Point(event.toRAW());
  }
}
