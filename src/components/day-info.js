import {castTimeFormat, createElement} from "../utils.js";
import {MONTH_NAMES} from "../const.js";

const tripDayInfoElementsTemplate = (count, dateString) => {
  const dateObj = JSON.parse(dateString);
  const {date, month, year} = dateObj;
  const newDateString = `${year}-${month}-${date}`;
  return (
    `<span class="day__counter">${count}</span>
    <time class="day__date" datetime="${newDateString}">
      ${MONTH_NAMES[month]} ${castTimeFormat(date)}
    </time>`
  );
};

const tripDayInfoElementTemplate = (eventSort, count, dateString) => {
  const dayInfoMarkup = eventSort ? tripDayInfoElementsTemplate(count, dateString) : ``;
  return (
    `<div class="day__info">
      ${dayInfoMarkup}
    </day>`
  );
};

export default class DayInfo {
  constructor(eventSort, count, dateString) {
    this._eventSort = eventSort;
    this._count = count;
    this._dateString = dateString;
    this._element = null;
  }

  getTemplate() {
    return tripDayInfoElementTemplate(this._eventSort, this._count, this._dateString);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
