import AbstractComponent from "../components/abstract-component.js";
import {castTimeFormat} from "../utils/common.js";
import {MONTH_NAMES} from "../const.js";

const tripDayInfoElementsTemplate = (count, dateToParse) => {
  const parsedDate = JSON.parse(dateToParse);
  const {date, month, year} = parsedDate;
  const newDate = `${year}-${month}-${date}`;
  return (
    `<span class="day__counter">${count}</span>
    <time class="day__date" datetime="${newDate}">
      ${MONTH_NAMES[month]} ${castTimeFormat(date)}
    </time>`
  );
};

const tripDayInfoElementTemplate = (eventSort, count, date) => {
  const dayInfoMarkup = eventSort ? tripDayInfoElementsTemplate(count, date) : ``;
  return (
    `<div class="day__info">
      ${dayInfoMarkup}
    </day>`
  );
};

export default class DayInfo extends AbstractComponent {
  constructor(eventSort, count, date) {
    super();
    this._eventSort = eventSort;
    this._count = count;
    this._date = date;
  }

  getTemplate() {
    return tripDayInfoElementTemplate(this._eventSort, this._count, this._date);
  }
}
