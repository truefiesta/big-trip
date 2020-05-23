import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {SortType, Mode} from "../const.js";
import DayComponent from "../components/day.js";
import DayInfoComponent from "../components/day-info.js";
import NoEventsComponent from "../components/no-events.js";
import LoadingComponent from "../components/loading-component.js";
import SortComponent from "../components/sort.js";
import DaysComponent from "../components/days.js";
import EventsComponent from "../components/events.js";
import EventItemComponent from "../components/event-item.js";
import PointController, {generateDefaultEvent} from "./point-controller.js";
import {HIDDEN_CLASS} from "../const.js";
import isEqual from "../../node_modules/lodash/isEqual";
import moment from "moment";

const OPENED = true;
const CLOSED = false;

// Логика для формирования дней
// Формирует массив с начальными датами событий.
const getEventsStartDates = (events) => {
  let startDates = [];
  for (const event of events) {
    startDates.push(event.time.startTime);
  }
  return startDates;
};

// Возвращает объект с данными о дне, месяце и годe.
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
// Возвращает массив строк с уникальными датами в виде строк.
const getEventsUniqueDates = (dates) => {
  const datesWithoutTime = dates.map((date) => getFullDate(date));
  let uniqueDates = new Set();
  for (const date of datesWithoutTime) {
    uniqueDates.add(JSON.stringify(date));
  }
  return Array.from(uniqueDates);
};

// Получает дату в виде строки "{"date": "1", "month": "11", "year": "2020"}"
// и массив с объектами-событиями.
// Возвращает массив объектов-событий, соответствующих дате.
const groupEventsByStartDate = (dateString, eventsArray) => {
  const dateObj = JSON.parse(dateString);
  const {date, month, year} = dateObj;
  const properDate = new Date(year, month, date);
  const nextDate = new Date(year, month, date + 1);

  return eventsArray.filter((eventItem) => {
    return eventItem.time.startTime >= properDate && eventItem.time.startTime < nextDate;
  });
};

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  const allEvents = events.slice();

  switch (sortType) {
    case SortType.SORT_EVENT: sortedEvents = allEvents.sort((a, b) =>
      a.time.startTime - b.time.startTime);
      break;
    case SortType.SORT_TIME: sortedEvents = allEvents.sort((a, b) =>
      (b.time.endTime - b.time.startTime) - (a.time.endTime - a.time.startTime));
      break;
    case SortType.SORT_PRICE: sortedEvents = allEvents.sort((a, b) =>
      b.price - a.price);
      break;
  }

  return sortedEvents;
};
// Для каждого дня (уникальной начальной даты) нужно сформировать разметку с выводом
// шаблона для дня и шаблона событий, соответствующих дню.
// Если сортировка не по event, то числа нужно спрятать. Все события будут выводиться в один
// шаблон дня.

// Events выводятся в days
// Сформируем структуру данных, в которой будут события по дате, фильтр, начальные даты.
const prepareDaysWithEventsBeforeRendering = (events, sortType) => {
  const daysAndEvents = [];
  let daysCount = 0;

  const sortedEvents = getSortedEvents(events, sortType);

  if (sortType === SortType.SORT_EVENT) {
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

// отрисовать DayComponent (<li class="trip-days__item  day"></li>)
//   - в DayComponent отрисовать DayInfoComponent (<div class="day__info"> (count, dateString) </div>)
//   - в DayComponent же отрисовть EventsComponent (<ul class="trip-events__list"></ul>)
//      - в EventsComponent отрисовать EventComponent (<li class="trip-events__item"> (events) </li>)
const renderDaysWithEvents = (tripDaysComponent, allEvents, sortType, onDataChange, onViewChange) => {
  const daysWithEvents = prepareDaysWithEventsBeforeRendering(allEvents, sortType);
  const allPointControllers = [];

  daysWithEvents.map((dayWithEvents) => {
    const {eventSort, daysCount, uniqDate, events} = dayWithEvents;
    // отрисовать DayComponent (<li class="trip-days__item day"></li>)
    const dayComponent = new DayComponent();
    render(tripDaysComponent.getElement(), dayComponent, RenderPosition.BEFOREEND);
    //    в DayComponent отрисовать DayInfoComponent (<div class="day__info"> (count, dateString) </div>)
    renderDayInfo(dayComponent, eventSort, daysCount, uniqDate);
    //    в DayComponent отрисовть EventsComponent (<ul class="trip-events__list"></ul>)
    const dayPointControllers = renderEvents(dayComponent, events, onDataChange, onViewChange);
    allPointControllers.push(...dayPointControllers);
  });

  return allPointControllers;
};

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._pointControllers = [];
    this._newEventFormToggleHandler = null;

    this._noEventsComponent = new NoEventsComponent();
    this._loadingComponent = null;
    this._sortComponent = null;
    this._daysComponent = new DaysComponent();
    this._eventBeingCreated = null;

    this._isLoading = true;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const tripEventsHeaderElement = this._container.querySelector(`h2`);
    if (this._isLoading) {
      this._loadingComponent = new LoadingComponent();
      render(tripEventsHeaderElement, this._loadingComponent, RenderPosition.AFTER);
      return;
    }

    const events = this._pointsModel.getEvents();
    if (events.length <= 0) {
      render(tripEventsHeaderElement, this._noEventsComponent, RenderPosition.AFTER);
      return;
    }

    this._renderSortComponent();
    render(this._container, this._daysComponent, RenderPosition.BEFOREEND);

    this._pointControllers = renderDaysWithEvents(this._daysComponent, events, SortType.SORT_EVENT, this._onDataChange, this._onViewChange);
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

  _callNewEventFormToggleHandler(openCloseMode) {
    if (this._newEventFormToggleHandler) {
      this._newEventFormToggleHandler(openCloseMode);
    }
  }

  _renderSortComponent() {
    const oldSortComponent = this._sortComponent;
    this._sortComponent = new SortComponent();
    this._sortComponent.setSortNameChangeHandler(this._onSortTypeChange);
    const tripEventsHeaderElement = this._container.querySelector(`h2`);

    if (oldSortComponent) {
      replace(this._sortComponent, oldSortComponent);
    } else {
      render(tripEventsHeaderElement, this._sortComponent, RenderPosition.AFTER);
    }
  }

  _removeEvents() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
    this._daysComponent.getElement().innerHTML = ``;
  }

  _updateEvents() {
    this._removeEvents();
    const events = this._pointsModel.getEvents();
    this._pointControllers = renderDaysWithEvents(this._daysComponent, events, SortType.SORT_EVENT, this._onDataChange, this._onViewChange);
  }

  _onDataChange(pointController, oldEvent, newEvent) {
    if (this._eventBeingCreated) {
      this._eventBeingCreated.destroy();
      this._eventBeingCreated = null;
      this._callNewEventFormToggleHandler(CLOSED);
      if (newEvent === null) {
        // Если расхотели создавать событие.
        pointController.destroy();
        this._updateEvents();
      } else {
        // Создание
        this._pointsModel.addEvent(newEvent);
        this._updateEvents();
      }
    } else if (newEvent === null) {
      // Удаление
      this._pointsModel.removeEvent(oldEvent.id);
      this._updateEvents();
    } else {
      // Обновление
      const isSuccess = this._pointsModel.updateEvent(oldEvent.id, newEvent);
      if (isSuccess) {
        const eventWithRevertedFavorite = Object.assign({}, newEvent, {isFavorite: !newEvent.isFavorite});
        if (isEqual(oldEvent, eventWithRevertedFavorite)) {
          // no rerender
        } else {
          pointController.render(newEvent, Mode.DEFAULT);
        }
      }
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._updateEvents();
    this._renderSortComponent();
  }

  _onSortTypeChange(sortType) {
    this._removeEvents();
    const events = this._pointsModel.getEvents();
    this._pointControllers = renderDaysWithEvents(this._daysComponent, events, sortType, this._onDataChange, this._onViewChange);
  }
}
