import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {getSortedEvents} from "../utils/common.js";
import {SortType, Mode} from "../const.js";
import DayComponent from "../components/day.js";
import DayInfoComponent from "../components/day-info.js";
import NoEventsComponent from "../components/no-events.js";
import LoadingComponent from "../components/loading-component.js";
import SortComponent from "../components/sort.js";
import DaysComponent from "../components/days.js";
import EventsComponent from "../components/events.js";
import EventItemComponent from "../components/event-item.js";
import PointController from "./point-controller.js";
import PointModel from "../models/point.js";
import {HIDDEN_CLASS, EventType} from "../const.js";
import isEqual from "../../node_modules/lodash/isEqual";
import cloneDeep from "../../node_modules/lodash/cloneDeep";
import moment from "moment";

const OPENED = true;
const CLOSED = false;

const DefaultEvent = {
  type: EventType.BUS,
  destination: ``,
  destinationInfo: {
    description: ``,
    photos: []
  },
  offers: [],
  time: {
    startTime: new Date(),
    endTime: new Date()
  },
  price: ``,
  isFavorite: false
};

const generateDefaultEvent = () => {
  const defauldEvent = cloneDeep(DefaultEvent);
  return defauldEvent;
};

const getEventsStartDates = (events) => {
  const startDates = [];
  for (const event of events) {
    startDates.push(event.time.startTime);
  }
  return startDates;
};

const getFullDate = (date) => {
  if (moment.isMoment(date)) {
    date = date.toDate();
  }
  return {
    date: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear()
  };
};

const getEventsUniqueDates = (dates) => {
  const datesWithoutTime = dates.map((date) => getFullDate(date));
  const uniqueDates = new Set();
  for (const date of datesWithoutTime) {
    uniqueDates.add(JSON.stringify(date));
  }
  return Array.from(uniqueDates);
};

const groupEventsByStartDate = (dateToParse, eventsArray) => {
  const parsedDate = JSON.parse(dateToParse);
  const {date, month, year} = parsedDate;
  const properDate = new Date(year, month, date);
  const nextDate = new Date(year, month, date + 1);

  return eventsArray.filter((eventItem) => {
    return eventItem.time.startTime >= properDate && eventItem.time.startTime < nextDate;
  });
};

const prepareDaysWithEventsBeforeRendering = (events, sortType) => {
  const daysAndEvents = [];
  let daysCount = 0;

  const sortedEvents = getSortedEvents(events, sortType);

  if (sortType === SortType.EVENT) {
    const startDates = getEventsStartDates(sortedEvents);
    const uniqDates = getEventsUniqueDates(startDates);

    for (const uniqDate of uniqDates) {
      const eventsByDate = groupEventsByStartDate(uniqDate, sortedEvents);
      daysCount++;

      daysAndEvents.push({
        eventSort: true,
        daysCount,
        uniqDate,
        events: eventsByDate
      });
    }
  } else {
    daysAndEvents.push({
      eventSort: false,
      daysCount: 1,
      uniqDate: ``,
      events: sortedEvents
    });
  }

  return daysAndEvents;
};

const renderDayInfo = (dayComponent, eventSort, daysCount, uniqDate) => {
  render(dayComponent.getElement(), new DayInfoComponent(eventSort, daysCount, uniqDate), RenderPosition.BEFOREEND);
};

const renderEvents = (dayComponent, events, onDataChange, onViewChange) => {
  render(dayComponent.getElement(), new EventsComponent(events), RenderPosition.BEFOREEND);
  const eventsListElement = dayComponent.getElement().querySelector(`.trip-events__list`);
  return events.map((event) => {
    const eventItemComponent = new EventItemComponent();
    render(eventsListElement, eventItemComponent, RenderPosition.BEFOREEND);
    const pointController = new PointController(eventItemComponent.getElement(), onDataChange, onViewChange);
    pointController.render(event, Mode.DEFAULT);
    return pointController;
  });
};

const renderDaysWithEvents = (tripDaysComponent, allEvents, sortType, onDataChange, onViewChange) => {
  const daysWithEvents = prepareDaysWithEventsBeforeRendering(allEvents, sortType);
  const allPointControllers = [];

  daysWithEvents.map((dayWithEvents) => {
    const {eventSort, daysCount, uniqDate, events} = dayWithEvents;
    const dayComponent = new DayComponent();
    render(tripDaysComponent.getElement(), dayComponent, RenderPosition.BEFOREEND);
    renderDayInfo(dayComponent, eventSort, daysCount, uniqDate);
    const dayPointControllers = renderEvents(dayComponent, events, onDataChange, onViewChange);
    allPointControllers.push(...dayPointControllers);
  });

  return allPointControllers;
};

export default class TripController {
  constructor(container, pointsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;

    this._pointControllers = [];
    this._newEventFormToggleHandler = null;

    this._noEventsComponent = null;
    this._loadingComponent = null;
    this._sortComponent = null;
    this._daysComponent = new DaysComponent();
    this._eventBeingCreated = null;
    this._currentSortType = SortType.EVENT;

    this._isLoading = true;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    this._removeEvents();

    if (this._isLoading) {
      this._renderLoadingComponent();

      return;
    }

    const events = this._pointsModel.getEvents();
    if (events.length <= 0) {
      this._removeSortComponent();
      this._renderNoEventsComponent();

      return;
    }

    this._removeLoadingComponent();
    this._removeNoEventsComponent();
    this._renderSortComponent();
    render(this._container, this._daysComponent, RenderPosition.BEFOREEND);

    this._pointControllers = renderDaysWithEvents(this._daysComponent, events, this._currentSortType, this._onDataChange, this._onViewChange);
  }

  createEvent() {
    if (this._eventBeingCreated) {
      return;
    }

    let containerForPointController = null;
    if (!this._sortComponent) {
      containerForPointController = this._container.querySelector(`h2`);
    } else {
      containerForPointController = this._sortComponent.getElement();
    }

    this._eventBeingCreated = new PointController(containerForPointController, this._onDataChange, this._onViewChange);
    this._eventBeingCreated.render(generateDefaultEvent(), Mode.ADDING);
    this._callNewEventFormToggleHandler(OPENED);
    this._removeNoEventsComponent();
  }

  hide() {
    this._container.classList.add(HIDDEN_CLASS);
  }

  show() {
    this._container.classList.remove(HIDDEN_CLASS);
  }

  setNoLoading() {
    if (this._isLoading) {
      this._isLoading = false;
      if (this._loadingComponent) {
        remove(this._loadingComponent);
        this._loadingComponent = null;
      }

      this.render();
    }
  }

  setNewEventFormToggleHandler(handler) {
    this._newEventFormToggleHandler = handler;
  }

  resetSorting() {
    this._setSortTypeAndRerender(SortType.EVENT);
  }

  _callNewEventFormToggleHandler(openCloseMode) {
    if (this._newEventFormToggleHandler) {
      this._newEventFormToggleHandler(openCloseMode);
    }
  }

  _removeLoadingComponent() {
    const oldLoadingComponent = this._loadingComponent;
    if (oldLoadingComponent) {
      remove(oldLoadingComponent);
      this._loadingComponent = null;
    }
  }

  _renderLoadingComponent() {
    if (this._loadingComponent) {
      return;
    }

    this._loadingComponent = new LoadingComponent();
    const tripEventsHeaderElement = this._container.querySelector(`h2`);
    render(tripEventsHeaderElement, this._loadingComponent, RenderPosition.AFTER);
  }

  _removeNoEventsComponent() {
    const oldNoEventsComponent = this._noEventsComponent;
    if (oldNoEventsComponent) {
      remove(oldNoEventsComponent);
      this._noEventsComponent = null;
    }
  }

  _renderNoEventsComponent() {
    if (this._noEventsComponent) {
      return;
    }

    this._noEventsComponent = new NoEventsComponent();
    const tripEventsHeaderElement = this._container.querySelector(`h2`);
    render(tripEventsHeaderElement, this._noEventsComponent, RenderPosition.AFTER);
  }

  _removeSortComponent() {
    const oldSortComponent = this._sortComponent;
    if (oldSortComponent) {
      remove(oldSortComponent);
      this._sortComponent = null;
    }
  }

  _renderSortComponent() {
    const oldSortComponent = this._sortComponent;
    this._sortComponent = new SortComponent(this._currentSortType);
    this._sortComponent.setSortNameChangeHandler(this._onSortTypeChange);

    if (oldSortComponent) {
      replace(this._sortComponent, oldSortComponent);
    } else {
      const tripEventsHeaderElement = this._container.querySelector(`h2`);
      render(tripEventsHeaderElement, this._sortComponent, RenderPosition.AFTER);
    }
  }

  _removeEvents() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
    this._daysComponent.getElement().innerHTML = ``;
  }

  _setSortTypeAndRerender(sortType) {
    this._currentSortType = sortType;
    this.render();
  }

  _removeEventBeingCreated() {
    this._eventBeingCreated.destroy();
    this._eventBeingCreated = null;
    this._callNewEventFormToggleHandler(CLOSED);
  }

  _onDataChange(pointController, oldEvent, newEvent) {
    if (this._eventBeingCreated) {
      if (newEvent === null) {
        if (this._pointsModel.getEvents().length <= 0) {
          this._renderNoEventsComponent();
        }
        this._removeEventBeingCreated();
        pointController.destroy();
      } else {
        this._api.createEvent(newEvent)
          .then((pointModel) => {
            this._removeEventBeingCreated();
            this._pointsModel.addEvent(pointModel);
            this.render();
          })
          .catch(() => {
            pointController.shake();
          });
      }
    } else if (newEvent === null) {
      this._api.deleteEvent(oldEvent.id)
        .then(() => {
          this._pointsModel.removeEvent(oldEvent.id);
          this.render();
        })
        .catch(() => {
          pointController.shake();
        });
    } else {
      this._api.updateEvent(oldEvent.id, newEvent)
        .then((updatedEvent) => {
          const isSuccess = this._pointsModel.updateEvent(oldEvent.id, updatedEvent);

          if (isSuccess) {
            const eventWithRevertedFavorite = PointModel.clone(updatedEvent);
            eventWithRevertedFavorite.isFavorite = !eventWithRevertedFavorite.isFavorite;
            if (isEqual(oldEvent, eventWithRevertedFavorite)) {
              pointController.setEventIsFavorite(updatedEvent.isFavorite);
              pointController.enableFavoriteButton();
            } else {
              this.render();
            }
          }
        })
        .catch(() => {
          pointController.shake();
        });
    }
  }

  _onFilterChange() {
    this.resetSorting();
  }

  _onViewChange() {
    if (this._eventBeingCreated) {
      this._removeEventBeingCreated();
    }
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._setSortTypeAndRerender(sortType);
  }
}
