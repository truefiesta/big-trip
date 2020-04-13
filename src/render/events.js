import {render} from "../utils.js";
import {createTripDayTemplate} from "../components/days.js";

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

// Для каждого дня (уникальной начальной даты) нужно сформировать разметку с выводом
// шаблона для дня и шаблона событий, соответствующих дню.
// Если сортировка не по event, то числа нужно спрятать. Все события будут выводиться в один
// шаблон дня.

// Events выводятся в days
// Сформируем структуру данных, в которой будут события по дате, фильтр, начальные даты.

const prepareDataBeforeRendering = (events, sort) => {
  sort = document.querySelector(`input[name=trip-sort]:checked`);
  const daysAndEvents = [];
  let daysCount = 0;

  const sortedByStartDayEvents = events.slice().sort(
      function (a, b) {
        return a.time.startTime - b.time.startTime;
      }
  );

  if (sort.value === `sort-event`) {
    const startDates = getEventsStartDates(sortedByStartDayEvents);
    const uniqDates = getEventsUniqueDates(startDates);

    for (const uniqDate of uniqDates) {
      const eventsByDate = groupEventsByStartDate(uniqDate, sortedByStartDayEvents);
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
      events: sortedByStartDayEvents
    });
  }

  return daysAndEvents;
};

export const renderDaysWithEvents = (tripDaysElement, events) => {
  const daysWithEventsToRender = prepareDataBeforeRendering(events);
  daysWithEventsToRender.forEach((dayWithEvents) => {
    render(tripDaysElement, createTripDayTemplate(dayWithEvents), `beforeend`);
  });
};
