import AbstractComponent from "../components/abstract-component.js";
import {MONTH_NAMES} from "../const.js";
const MDASH = `&nbsp;&mdash;&nbsp;`;
const HELLIP = `&nbsp;&mdash;&nbsp;&hellip;&nbsp;&mdash;&nbsp;`;

const createTripMainInfoElement = (info) => {
  const {destinations, startDate, endDate} = info;

  let title;
  if (destinations.length > 3) {
    const firstDestination = destinations[0];
    const lastDestination = destinations[destinations.length - 1];
    title = `${firstDestination}${HELLIP}${lastDestination}`;
  } else {
    const titleString = destinations.reduce((acc, destination) => {
      return acc.concat(destination, MDASH);
    }, ``);
    title = titleString.slice(0, titleString.length - MDASH.length);
  }

  const startDay = startDate.getDate();
  const startMonth = startDate.getMonth();
  const endDay = endDate.getDate();
  const endMonth = endDate.getMonth();
  let dates;
  if (startMonth === endMonth) {
    dates = `${MONTH_NAMES[startMonth]} ${startDay}${MDASH}${endDay}`;
  } else {
    dates = `${MONTH_NAMES[startMonth]} ${startDay}${MDASH}${MONTH_NAMES[endMonth]} ${endDay}`;
  }

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>

      <p class="trip-info__dates">${dates}</p>
    </div>`
  );
};

export default class Info extends AbstractComponent {
  constructor(info) {
    super();
    this._info = info;
  }

  getTemplate() {
    return createTripMainInfoElement(this._info);
  }
}
