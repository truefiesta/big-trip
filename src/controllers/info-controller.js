import InfoComponent from "../components/info.js";
import {remove, render, replace, RenderPosition} from "../utils/render.js";

const getTripDestinations = (events) => {
  return events.map(({destination}) => {
    return destination;
  });
};

const getTripStartDate = (events) => {
  return events[0].time.startTime;
};

const getTripEndDate = (events) => {
  const lastIndex = events.length - 1;
  return events[lastIndex].time.endTime;
};

export default class InfoController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._infoComponent = null;

    this._onEventsChange = this._onEventsChange.bind(this);
    this._pointsModel.setEventsChangeHandler(this._onEventsChange);
  }

  render() {
    const events = this._pointsModel.getEventsSortedByStartTime();
    const oldInfoComponent = this._infoComponent;

    if (events.length === 0) {
      if (oldInfoComponent) {
        remove(oldInfoComponent);
        this._infoComponent = null;
      }

      return;
    }

    const info = {
      destinations: getTripDestinations(events),
      startDate: getTripStartDate(events),
      endDate: getTripEndDate(events)
    };

    this._infoComponent = new InfoComponent(info);
    if (oldInfoComponent) {
      replace(this._infoComponent, oldInfoComponent);
    } else {
      render(this._container, this._infoComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onEventsChange() {
    this.render();
  }
}

