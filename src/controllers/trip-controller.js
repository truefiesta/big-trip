import {renderDaysWithEvents} from "../render/events";

export default class TripController {
  constructor(container) {
    this._container = container;
  }

  render(events) {
    renderDaysWithEvents(this._container, events);
  }
}
