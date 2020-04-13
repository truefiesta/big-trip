import {createTripEventItemTemplate} from "../components/event.js";
import {MONTH_NAMES} from "../const.js";
import {castTimeFormat} from "../utils.js";

const dayInfoElementsTemplate = (count, dateString) => {
  const dateObj = JSON.parse(dateString);
  const {date, month, year} = dateObj;
  const newDateString = `${year}-${month}-${date}`;
  return (
    `<span class="day__counter">${count}</span>
    <time class="day__date" datetime="${newDateString}">${MONTH_NAMES[month]} ${castTimeFormat(date)}</time>`
  );
};

export const createTripDayTemplate = (dayWithEvents) => {
  const {eventSort, daysCount, uniqDate, events} = dayWithEvents;
  const dayInfoMarkup = eventSort ? dayInfoElementsTemplate(daysCount, uniqDate) : ``;
  const eventsMarkup = events.map((event) => {
    return createTripEventItemTemplate(event);
  }).join(`\n`);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        ${dayInfoMarkup}
      </div>
      <ul class="trip-events__list">
      ${eventsMarkup}
      </ul>
    </li>`
  );
};

export const createTripDaysTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};
