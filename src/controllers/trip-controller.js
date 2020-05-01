import {render, RenderPosition} from "../utils/render.js";
import {SortType} from "../const.js";
import DayComponent from "../components/day.js";
import DayInfoComponent from "../components/day-info.js";
import NoEventsComponent from "../components/no-events.js";
import SortComponent from "../components/sort.js";
import DaysComponent from "../components/days.js";
import EventsComponent from "../components/events.js";
import PointController from "./point-controller.js";

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
      (a.time.endTime - a.time.startTime) - (b.time.endTime - b.time.startTime));
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

const renderEvents = (dayComponent, events, onDataChange) => {
  render(dayComponent.getElement(), new EventsComponent(events), RenderPosition.BEFOREEND);
  const eventsListElement = dayComponent.getElement().querySelector(`.trip-events__list`);

  return events.map((event) => {
    const pointController = new PointController(eventsListElement, onDataChange);
    pointController.render(event);
  });
};

// отрисовать DayComponent (<li class="trip-days__item  day"></li>)
//   - в DayComponent отрисовать DayInfoComponent (<div class="day__info"> (count, dateString) </div>)
//   - в DayComponent же отрисовть EventsComponent (<ul class="trip-events__list"></ul>)
//      - в EventsComponent отрисовать EventComponent (<li class="trip-events__item"> (events) </li>)
const renderDaysWithEvents = (tripDaysComponent, allEvents, sortType, onDataChange) => {
  const daysWithEvents = prepareDaysWithEventsBeforeRendering(allEvents, sortType);

  daysWithEvents.forEach((dayWithEvents) => {
    const {eventSort, daysCount, uniqDate, events} = dayWithEvents;
    // отрисовать DayComponent (<li class="trip-days__item day"></li>)
    const dayComponent = new DayComponent();
    render(tripDaysComponent.getElement(), dayComponent, RenderPosition.BEFOREEND);
    //    в DayComponent отрисовать DayInfoComponent (<div class="day__info"> (count, dateString) </div>)
    renderDayInfo(dayComponent, eventSort, daysCount, uniqDate);
    //    в DayComponent отрисовть EventsComponent (<ul class="trip-events__list"></ul>)
    renderEvents(dayComponent, events, onDataChange);
  });
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._events = [];
    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysComponent = new DaysComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortNameChangeHandler(this._onSortTypeChange);
  }

  render(events) {
    this._events = events;

    const tripEventsHeaderElement = this._container.querySelector(`h2`);

    if (this._events.length <= 0) {
      render(tripEventsHeaderElement, this._noEventsComponent, RenderPosition.AFTER);
      return;
    }

    render(tripEventsHeaderElement, this._sortComponent, RenderPosition.AFTER);
    render(this._container, this._daysComponent, RenderPosition.BEFOREEND);

    renderDaysWithEvents(this._daysComponent, this._events, SortType.SORT_EVENT, this._onDataChange);
  }

  _onDataChange(pointController, oldPoint, newPoint) {
    const index = this._events.findIndex((event) => event === oldPoint);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newPoint, this._events.slice(index + 1));

    pointController.render(this._events[index]);
  }

  _onSortTypeChange(sortType) {
    this._daysComponent.getElement().innerHTML = ``;
    renderDaysWithEvents(this._daysComponent, this._events, sortType, this._onDataChange);
  }
}
