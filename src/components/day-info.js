import AbstractComponent from "../components/abstract-component.js";
import {castTimeFormat} from "../utils.js";
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

export default class DayInfo extends AbstractComponent {
  constructor(eventSort, count, dateString) {
    super();
    this._eventSort = eventSort;
    this._count = count;
    this._dateString = dateString;
  }

  getTemplate() {
    return tripDayInfoElementTemplate(this._eventSort, this._count, this._dateString);
  }
}
