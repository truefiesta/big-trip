import AbstractComponent from "../components/abstract-component.js";
import {formatTime, formatDate, formatDurationFromDates, capitalize} from "../utils/common.js";
import {activityTypes} from "../const.js";

const SELECTED_OFFERS_COUNT = 3;

const createOffersMarkup = (offers) => {
  return offers.map(({title, price}) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </li>`
    );
  }).join(`\n`);
};

const createTripEventItemTemplate = (event) => {
  const {type, destination, offers, time, price} = event;
  const isActivityType = activityTypes.includes(type.toLowerCase()) ? ` in` : ` to`;
  const selectedOffers = offers.slice(0, SELECTED_OFFERS_COUNT);
  const offersMarkup = createOffersMarkup(selectedOffers);
  const {startTime, endTime} = time;

  return (
    `<div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${capitalize(type)} ${isActivityType} ${destination}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${formatDate(startTime)}">${formatTime(startTime)}</time>
          &mdash;
          <time class="event__end-time" datetime="${formatDate(endTime)}">${formatTime(endTime)}</time>
        </p>
        <p class="event__duration">${formatDurationFromDates(startTime, endTime)}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersMarkup}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`
  );
};

export default class Event extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  setOpenButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }

  getTemplate() {
    return createTripEventItemTemplate(this._event);
  }
}
