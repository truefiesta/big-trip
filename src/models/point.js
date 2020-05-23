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

  static parseEvent(event) {
    return new Point(event);
  }

  static parseEvents(events) {
    return events.map(Point.parseEvent);
  }
}
